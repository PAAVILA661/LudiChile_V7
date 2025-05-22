import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../update'; // The API handler
import { prisma } from '@/lib/prisma'; // Prisma client

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    exercise: {
      findUnique: jest.fn(),
    },
    userProgress: {
      upsert: jest.fn(),
    },
    userXP: {
      upsert: jest.fn(),
    },
  },
}));

// Helper to type cast mocked Prisma functions
const mockPrismaExerciseFindUnique = prisma.exercise.findUnique as jest.Mock;
const mockPrismaUserProgressUpsert = prisma.userProgress.upsert as jest.Mock;
const mockPrismaUserXPUpsert = prisma.userXP.upsert as jest.Mock;

describe('/api/progress/update API Endpoint', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockPrismaExerciseFindUnique.mockReset();
    mockPrismaUserProgressUpsert.mockReset();
    mockPrismaUserXPUpsert.mockReset();
  });

  const defaultUserId = 'test-user-123';
  const defaultExerciseSlug = '01-test-exercise';
  const defaultExerciseId = 'exercise-id-001';
  const defaultXpValue = 10;

  test('1. Valid Request (New Progress): should return 200 OK and update progress/XP', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        exerciseSlug: defaultExerciseSlug,
      },
    });

    mockPrismaExerciseFindUnique.mockResolvedValue({
      id: defaultExerciseId,
      xp_value: defaultXpValue,
    });
    mockPrismaUserProgressUpsert.mockResolvedValue({
      userId: defaultUserId,
      exerciseId: defaultExerciseId,
      status: 'COMPLETED',
      completed_at: new Date(),
    });
    mockPrismaUserXPUpsert.mockResolvedValue({
      userId: defaultUserId,
      total_xp: defaultXpValue, // Assuming this is the first exercise, so total_xp = xp_value
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.message).toBe('Progress updated successfully');
    expect(responseData.updatedUserProgress.exerciseId).toBe(defaultExerciseId);
    expect(responseData.updatedUserProgress.status).toBe('COMPLETED');
    expect(responseData.total_xp).toBe(defaultXpValue);

    expect(mockPrismaExerciseFindUnique).toHaveBeenCalledWith({
      where: { slug: defaultExerciseSlug },
      select: { id: true, xp_value: true },
    });
    expect(mockPrismaUserProgressUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_exerciseId: { userId: defaultUserId, exerciseId: defaultExerciseId } },
        create: { userId: defaultUserId, exerciseId: defaultExerciseId, status: 'COMPLETED', completed_at: expect.any(Date) },
        update: { status: 'COMPLETED', completed_at: expect.any(Date) },
      })
    );
    expect(mockPrismaUserXPUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: defaultUserId },
        create: { userId: defaultUserId, total_xp: defaultXpValue },
        update: { total_xp: { increment: defaultXpValue } },
        select: { total_xp: true },
      })
    );
  });

  test('2. Valid Request (Existing Progress for Re-completion): should return 200 OK and update completed_at', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        exerciseSlug: defaultExerciseSlug,
      },
    });

    const initialTotalXp = 20; // User already has some XP
    const newCompletedDate = new Date();

    mockPrismaExerciseFindUnique.mockResolvedValue({
      id: defaultExerciseId,
      xp_value: defaultXpValue,
    });
    // Simulate UserProgress.upsert updating the record
    mockPrismaUserProgressUpsert.mockResolvedValue({
      userId: defaultUserId,
      exerciseId: defaultExerciseId,
      status: 'COMPLETED',
      completed_at: newCompletedDate, // Ensure this date is updated
    });
    // Simulate UserXP.upsert incrementing existing XP
    mockPrismaUserXPUpsert.mockResolvedValue({
      userId: defaultUserId,
      total_xp: initialTotalXp + defaultXpValue,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.message).toBe('Progress updated successfully');
    expect(responseData.updatedUserProgress.status).toBe('COMPLETED');
    // Check if completed_at is close to newCompletedDate, allowing for slight differences if new Date() is called again in handler
    expect(new Date(responseData.updatedUserProgress.completed_at).getTime()).toBeGreaterThanOrEqual(newCompletedDate.getTime() - 1000);
    expect(new Date(responseData.updatedUserProgress.completed_at).getTime()).toBeLessThanOrEqual(newCompletedDate.getTime() + 1000);


    expect(mockPrismaUserProgressUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { status: 'COMPLETED', completed_at: expect.any(Date) },
        })
      );
    // The main check is that upsert was called and that the completed_at time reflects a recent update.
  });
  
  test('3. Exercise Not Found: should return 404 Not Found', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        exerciseSlug: 'non-existent-slug',
      },
    });

    mockPrismaExerciseFindUnique.mockResolvedValue(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData()).message).toBe("Exercise with slug 'non-existent-slug' not found");
  });

  test('4. Missing userId in Request: should return 400 Bad Request', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        // userId is missing
        exerciseSlug: defaultExerciseSlug,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).message).toBe('Missing userId or exerciseSlug in request body');
  });

  test('5. Missing exerciseSlug in Request: should return 400 Bad Request', async () => {
     const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        // exerciseSlug is missing
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).message).toBe('Missing userId or exerciseSlug in request body');
  });

  test('6. Prisma exercise.findUnique Fails: should return 500 Internal Server Error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        exerciseSlug: defaultExerciseSlug,
      },
    });

    mockPrismaExerciseFindUnique.mockRejectedValue(new Error('Database connection error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).message).toBe('Internal server error while updating progress');
  });

  test('7. Prisma userProgress.upsert Fails: should return 500 Internal Server Error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        exerciseSlug: defaultExerciseSlug,
      },
    });

    mockPrismaExerciseFindUnique.mockResolvedValue({ id: defaultExerciseId, xp_value: defaultXpValue });
    mockPrismaUserProgressUpsert.mockRejectedValue(new Error('Database write error for UserProgress'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).message).toBe('Internal server error while updating progress');
  });

  test('8. Prisma userXP.upsert Fails: should return 500 Internal Server Error', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        exerciseSlug: defaultExerciseSlug,
      },
    });

    mockPrismaExerciseFindUnique.mockResolvedValue({ id: defaultExerciseId, xp_value: defaultXpValue });
    mockPrismaUserProgressUpsert.mockResolvedValue({ 
        userId: defaultUserId, 
        exerciseId: defaultExerciseId, 
        status: 'COMPLETED', 
        completed_at: new Date() 
    });
    mockPrismaUserXPUpsert.mockRejectedValue(new Error('Database write error for UserXP'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).message).toBe('Internal server error while updating progress');
  });

  test('9. Exercise with null xp_value: should return 200 OK and update XP as if 0', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        userId: defaultUserId,
        exerciseSlug: defaultExerciseSlug,
      },
    });
    
    const initialUserXp = 50; // User already has 50 XP

    mockPrismaExerciseFindUnique.mockResolvedValue({
      id: defaultExerciseId,
      xp_value: null, // Exercise has null xp_value
    });
    mockPrismaUserProgressUpsert.mockResolvedValue({
      userId: defaultUserId,
      exerciseId: defaultExerciseId,
      status: 'COMPLETED',
      completed_at: new Date(),
    });
    mockPrismaUserXPUpsert.mockResolvedValue({
      userId: defaultUserId,
      total_xp: initialUserXp, // XP should remain unchanged if xp_value is null (increment by 0)
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.message).toBe('Progress updated successfully');
    expect(responseData.total_xp).toBe(initialUserXp); // Total XP should not change

    expect(mockPrismaUserXPUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: { userId: defaultUserId, total_xp: 0 }, // xp_value from exercise is 0
        update: { total_xp: { increment: 0 } }, // xp_value from exercise is 0
      })
    );
  });

  test('Method Not Allowed (GET): should return 405', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET', // Invalid method
      body: {
        userId: defaultUserId,
        exerciseSlug: defaultExerciseSlug,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toBe('POST');
    expect(JSON.parse(res._getData()).message).toBe('Method GET Not Allowed');
  });
});
