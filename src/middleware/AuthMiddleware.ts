import { LoggingService } from '../services/LoggingService'
import SecureStorageService from '../services/SecureStorageService'

interface UserRole {
  id: string
  name: string
  permissions: string[]
}

interface AuthToken {
  userId: string
  roles: UserRole[]
  expiresAt: number
}

class AuthMiddleware {
  private static instance: AuthMiddleware
  private logger: LoggingService
  private storage: SecureStorageService

  private constructor() {
    this.logger = LoggingService.getInstance()
    this.storage = SecureStorageService.getInstance()
  }

  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware()
    }
    return AuthMiddleware.instance
  }

  public setAuthToken(token: AuthToken): void {
    try {
      this.storage.set('auth_token', token, {
        encrypt: true,
        expires: token.expiresAt - Date.now(),
      })
      this.logger.info('Auth token set successfully')
    }
    catch (error) {
      this.logger.error('Failed to set auth token', { error })
    }
  }

  public getAuthToken(): AuthToken | null {
    try {
      const token = this.storage.get<AuthToken>('auth_token', { decrypt: true })

      if (!token) {
        return null
      }

      // Check token expiration
      if (token.expiresAt < Date.now()) {
        this.clearAuthToken()
        return null
      }

      return token
    }
    catch (error) {
      this.logger.error('Failed to retrieve auth token', { error })
      return null
    }
  }

  public clearAuthToken(): void {
    try {
      this.storage.remove('auth_token')
      this.logger.info('Auth token cleared')
    }
    catch (error) {
      this.logger.error('Failed to clear auth token', { error })
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getAuthToken()
    return !!token && token.expiresAt > Date.now()
  }

  public hasPermission(requiredPermission: string): boolean {
    const token = this.getAuthToken()

    if (!token) {
      return false
    }

    return token.roles.some(role =>
      role.permissions.includes(requiredPermission),
    )
  }

  public getUserRoles(): UserRole[] {
    const token = this.getAuthToken()
    return token ? token.roles : []
  }

  public async refreshToken(): Promise<boolean> {
    try {
      // Implement token refresh logic
      // This would typically involve calling an API to get a new token
      // For now, this is a placeholder
      this.logger.info('Token refresh initiated')
      return true
    }
    catch (error) {
      this.logger.error('Token refresh failed', { error })
      this.clearAuthToken()
      return false
    }
  }

  public logout(): void {
    this.clearAuthToken()
    // Additional logout logic like redirecting to login page
    this.logger.info('User logged out')
  }
}

export default AuthMiddleware
