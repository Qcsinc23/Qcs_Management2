// Temporary mock auth service for testing
export const createClerkClient = () => ({
  users: {
    getUser: async () => ({
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    }),
  },
})

export const auth = {
  isAuthenticated: true,
  user: {
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
  },
}
