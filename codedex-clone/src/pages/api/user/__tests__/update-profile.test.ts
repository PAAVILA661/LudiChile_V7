import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import handler from '../update-profile'; // The API handler
import { prisma } from '@/lib/prisma'; // Prisma client

// --- Mocks ---
jest.mock('jsonwebtoken');
const mockJwtVerify = jwt.verify as jest.Mock;

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));
const mockPrismaUserUpdate = prisma.user.update as jest.Mock;

// --- Test Setup ---
const JWT_SECRET = 'test-secret'; // Use a consistent secret for tests
process.env.JWT_SECRET = JWT_SECRET; // Set for the handler
const COOKIE_NAME = 'codedex_session_token';

describe('/api/user/update-profile API Endpoint', () => {
  beforeEach(() => {
    mockJwtVerify.mockReset();
    mockPrismaUserUpdate.mockReset();
  });

  const defaultAuthenticatedUserId = 'auth-user-id-123';
  const defaultUserEmail = 'user@example.com';
  const defaultUserRole = 'USER';

  const mockValidToken = (userId = defaultAuthenticatedUserId, role = defaultUserRole) => {
    return jwt.sign({ userId, role, email: defaultUserEmail }, JWT_SECRET, { expiresIn: '1h' });
  };

  // --- Test Scenarios ---

  // 1. Valid Name Update
  test('1. Valid Name Update: should return 200 OK and updated user data', async () => {
    const newName = 'New Name';
    const token = mockValidToken();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      cookies: { [COOKIE_NAME]: token },
      body: { name: newName },
    });

    mockJwtVerify.mockReturnValue({ userId: defaultAuthenticatedUserId, role: defaultUserRole });
    const expectedUpdatedUser = {
      id: defaultAuthenticatedUserId,
      name: newName,
      email: defaultUserEmail,
      role: defaultUserRole,
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockPrismaUserUpdate.mockResolvedValue(expectedUpdatedUser);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.user.name).toBe(newName);
    expect(responseData.user.id).toBe(defaultAuthenticatedUserId);
    expect(mockPrismaUserUpdate).toHaveBeenCalledWith({
      where: { id: defaultAuthenticatedUserId },
      data: { name: newName, updated_at: expect.any(Date) },
      select: {
        id: true, name: true, email: true, role: true, created_at: true, updated_at: true,
      },
    });
  });

  // 2. Unauthorized - No Token
  test('2. Unauthorized - No Token: should return 401', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { name: 'Any Name' },
      // No cookies
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData()).message).toBe('Not authenticated: No session token provided');
  });

  // 3. Unauthorized - Invalid Token
  test('3. Unauthorized - Invalid Token: should return 401', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      cookies: { [COOKIE_NAME]: 'invalid-token-string' },
      body: { name: 'Any Name' },
    });

    mockJwtVerify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('jwt malformed');
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData()).message).toBe('Not authenticated: Invalid or expired token');
  });

  // 4. Forbidden - User ID Mismatch
  test('4. Forbidden - User ID Mismatch in body: should return 403', async () => {
    const token = mockValidToken(defaultAuthenticatedUserId); // Token for user A
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      cookies: { [COOKIE_NAME]: token },
      body: { 
        userId: 'different-user-id-456', // Body attempts to specify user B
        name: 'New Name for User B' 
      },
    });

    mockJwtVerify.mockReturnValue({ userId: defaultAuthenticatedUserId, role: defaultUserRole });
    // Prisma should not be called in this case
    
    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(JSON.parse(res._getData()).message).toBe('Forbidden: User ID in request body does not match authenticated user.');
    expect(mockPrismaUserUpdate).not.toHaveBeenCalled();
  });

  // 5. Bad Request - Empty Name
  test('5. Bad Request - Empty Name: should return 400', async () => {
    const token = mockValidToken();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      cookies: { [COOKIE_NAME]: token },
      body: { name: '' }, // Empty name
    });

    mockJwtVerify.mockReturnValue({ userId: defaultAuthenticatedUserId, role: defaultUserRole });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).message).toBe('Name is required and cannot be empty.');
  });

  // 6. Bad Request - Name Too Long
  test('6. Bad Request - Name Too Long: should return 400', async () => {
    const token = mockValidToken();
    const longName = 'a'.repeat(51); // 51 characters
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      cookies: { [COOKIE_NAME]: token },
      body: { name: longName },
    });

    mockJwtVerify.mockReturnValue({ userId: defaultAuthenticatedUserId, role: defaultUserRole });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).message).toBe('Name cannot exceed 50 characters.');
  });

  // 7. Prisma user.update Fails
  describe('7. Prisma user.update Failures', () => {
    test('Prisma P2025 (User Not Found): should return 404', async () => {
      const token = mockValidToken();
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        cookies: { [COOKIE_NAME]: token },
        body: { name: 'Valid Name' },
      });

      mockJwtVerify.mockReturnValue({ userId: defaultAuthenticatedUserId, role: defaultUserRole });
      mockPrismaUserUpdate.mockRejectedValue({ code: 'P2025', message: 'Record to update not found.' });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
      expect(JSON.parse(res._getData()).message).toBe('User not found for update.');
    });

    test('Other Prisma/DB Error: should return 500', async () => {
      const token = mockValidToken();
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        cookies: { [COOKIE_NAME]: token },
        body: { name: 'Valid Name' },
      });

      mockJwtVerify.mockReturnValue({ userId: defaultAuthenticatedUserId, role: defaultUserRole });
      mockPrismaUserUpdate.mockRejectedValue(new Error('Some other database error'));

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData()).message).toBe('Internal server error while updating profile.');
    });
  });

  // 8. Method Not Allowed
  test('8. Method Not Allowed (GET): should return 405', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET', // Invalid method
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toBe('POST');
    expect(JSON.parse(res._getData()).message).toBe('Method GET Not Allowed');
  });
});
