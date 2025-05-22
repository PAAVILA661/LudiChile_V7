import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import handler from '../stats'; // The API handler
import { prisma } from '@/lib/prisma'; // Prisma client

// --- Mocks ---
jest.mock('jsonwebtoken');
const mockJwtVerify = jwt.verify as jest.Mock;

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      count: jest.fn(),
    },
    userProgress: {
      count: jest.fn(),
    },
    userXP: {
      aggregate: jest.fn(),
    },
  },
}));
const mockPrismaUserCount = prisma.user.count as jest.Mock;
const mockPrismaUserProgressCount = prisma.userProgress.count as jest.Mock;
const mockPrismaUserXPAggregate = prisma.userXP.aggregate as jest.Mock;

// --- Test Setup ---
const JWT_SECRET = 'test-secret-admin'; 
process.env.JWT_SECRET = JWT_SECRET; 
const COOKIE_NAME = 'codedex_session_token';

describe('/api/admin/stats API Endpoint', () => {
  beforeEach(() => {
    mockJwtVerify.mockReset();
    mockPrismaUserCount.mockReset();
    mockPrismaUserProgressCount.mockReset();
    mockPrismaUserXPAggregate.mockReset();
  });

  const mockAdminToken = (userId = 'admin-user-id') => {
    return jwt.sign({ userId, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '1h' });
  };
  const mockStudentToken = (userId = 'student-user-id') => {
    return jwt.sign({ userId, role: 'STUDENT' }, JWT_SECRET, { expiresIn: '1h' });
  };

  // --- Test Scenarios ---

  // 1. Successful Stats Retrieval (Admin User)
  test('1. Successful Stats Retrieval (Admin User): should return 200 OK with stats', async () => {
    const token = mockAdminToken();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      cookies: { [COOKIE_NAME]: token },
    });

    mockJwtVerify.mockReturnValue({ userId: 'admin-user-id', role: 'ADMIN' });
    mockPrismaUserCount.mockResolvedValue(10);
    mockPrismaUserProgressCount.mockResolvedValue(50);
    mockPrismaUserXPAggregate.mockResolvedValue({ _sum: { total_xp: 1000 } });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({
      totalUsers: 10,
      totalCompletedExercises: 50,
      totalSystemXP: 1000,
    });
    expect(mockPrismaUserCount).toHaveBeenCalledTimes(1);
    expect(mockPrismaUserProgressCount).toHaveBeenCalledWith({ where: { status: 'COMPLETED' } });
    expect(mockPrismaUserXPAggregate).toHaveBeenCalledWith({ _sum: { total_xp: true } });
  });

  // 2. Successful Stats Retrieval (No XP Data)
  test('2. Successful Stats Retrieval (No XP Data): should return 200 OK with totalSystemXP as 0', async () => {
    const token = mockAdminToken();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      cookies: { [COOKIE_NAME]: token },
    });

    mockJwtVerify.mockReturnValue({ userId: 'admin-user-id', role: 'ADMIN' });
    mockPrismaUserCount.mockResolvedValue(5);
    mockPrismaUserProgressCount.mockResolvedValue(20);
    mockPrismaUserXPAggregate.mockResolvedValue({ _sum: { total_xp: null } }); // No XP

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).totalSystemXP).toBe(0);
  });

  // 3. Forbidden - Non-Admin User
  test('3. Forbidden - Non-Admin User: should return 403', async () => {
    const token = mockStudentToken(); // Non-admin role
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      cookies: { [COOKIE_NAME]: token },
    });

    mockJwtVerify.mockReturnValue({ userId: 'student-user-id', role: 'STUDENT' });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(JSON.parse(res._getData()).message).toBe('Forbidden: User does not have ADMIN privileges');
    expect(mockPrismaUserCount).not.toHaveBeenCalled();
  });

  // 4. Unauthorized - No Token
  test('4. Unauthorized - No Token: should return 401', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      // No cookies
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData()).message).toBe('Not authenticated: No session token provided');
  });

  // 5. Unauthorized - Invalid Token
  test('5. Unauthorized - Invalid Token: should return 401', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      cookies: { [COOKIE_NAME]: 'invalid-token' },
    });

    mockJwtVerify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('jwt malformed');
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData()).message).toBe('Not authenticated: Invalid or expired token');
  });

  // 6. Prisma user.count Fails
  test('6. Prisma user.count Fails: should return 500', async () => {
    const token = mockAdminToken();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      cookies: { [COOKIE_NAME]: token },
    });

    mockJwtVerify.mockReturnValue({ userId: 'admin-user-id', role: 'ADMIN' });
    mockPrismaUserCount.mockRejectedValue(new Error('DB error on user.count'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).message).toBe('Internal server error while fetching platform stats');
  });

  // 7. Prisma userProgress.count Fails
  test('7. Prisma userProgress.count Fails: should return 500', async () => {
    const token = mockAdminToken();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      cookies: { [COOKIE_NAME]: token },
    });

    mockJwtVerify.mockReturnValue({ userId: 'admin-user-id', role: 'ADMIN' });
    mockPrismaUserCount.mockResolvedValue(10); // This one succeeds
    mockPrismaUserProgressCount.mockRejectedValue(new Error('DB error on userProgress.count'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).message).toBe('Internal server error while fetching platform stats');
  });

  // 8. Prisma userXP.aggregate Fails
  test('8. Prisma userXP.aggregate Fails: should return 500', async () => {
    const token = mockAdminToken();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      cookies: { [COOKIE_NAME]: token },
    });

    mockJwtVerify.mockReturnValue({ userId: 'admin-user-id', role: 'ADMIN' });
    mockPrismaUserCount.mockResolvedValue(10);
    mockPrismaUserProgressCount.mockResolvedValue(50);
    mockPrismaUserXPAggregate.mockRejectedValue(new Error('DB error on userXP.aggregate'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData()).message).toBe('Internal server error while fetching platform stats');
  });

  // 9. Method Not Allowed
  test('9. Method Not Allowed (POST): should return 405', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST', // Invalid method
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toBe('GET');
    expect(JSON.parse(res._getData()).message).toBe('Method POST Not Allowed');
  });
});
