import { createClerkClient } from '@clerk/backend';

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || '',
  apiUrl: process.env.CLERK_API_URL || 'https://api.clerk.dev',
  apiVersion: process.env.CLERK_API_VERSION || 'v1',
});

export async function verifySession(token: string) {
  return clerkClient.sessions.verifyToken(token);
}

export async function signIn(email: string, password: string) {
  return clerkClient.users.authenticateWithPassword({
    identifier: email,
    password,
  });
}

export async function signOut(sessionId: string) {
  return clerkClient.sessions.revokeSession(sessionId);
}

interface SignUpParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export async function signUp(params: SignUpParams) {
  return clerkClient.users.createUser({
    emailAddress: [params.email],
    password: params.password,
    firstName: params.firstName,
    lastName: params.lastName,
  });
}

export function checkUserRole(requiredRole: string, userRole: string): boolean {
  return userRole === requiredRole;
}
