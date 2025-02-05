import { LoggingService } from './LoggingService'

interface StorageOptions {
  encrypt?: boolean
  expires?: number // in milliseconds
}

class SecureStorageService {
  private static instance: SecureStorageService
  private logger: LoggingService

  private constructor() {
    this.logger = LoggingService.getInstance()
  }

  public static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService()
    }
    return SecureStorageService.instance
  }

  private encrypt(data: string): string {
    try {
      // Simple XOR encryption (replace with more robust encryption in production)
      const key = 'your-secret-encryption-key'
      let result = ''
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      }
      return btoa(result) // Base64 encode
    }
    catch (error) {
      this.logger.error('Encryption failed', { error })
      throw new Error('Encryption failed')
    }
  }

  private decrypt(encryptedData: string): string {
    try {
      const key = 'your-secret-encryption-key'
      const decoded = atob(encryptedData)
      let result = ''
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      }
      return result
    }
    catch (error) {
      this.logger.error('Decryption failed', { error })
      throw new Error('Decryption failed')
    }
  }

  public set(key: string, value: unknown, options: StorageOptions = {}): void {
    try {
      const { encrypt: shouldEncrypt = false, expires } = options

      const storageItem = {
        value,
        timestamp: Date.now(),
        expires: expires ? Date.now() + expires : null,
      }

      const serializedData = JSON.stringify(storageItem)
      const processedData = shouldEncrypt ? this.encrypt(serializedData) : serializedData

      localStorage.setItem(key, processedData)
    }
    catch (error) {
      this.logger.error('Storage set failed', { key, error })
      throw new Error('Failed to set storage item')
    }
  }

  public get<T>(key: string, options: { decrypt?: boolean } = {}): T | null {
    try {
      const { decrypt: shouldDecrypt = false } = options
      const storedItem = localStorage.getItem(key)

      if (!storedItem)
        return null

      const processedData = shouldDecrypt ? this.decrypt(storedItem) : storedItem
      const parsedItem = JSON.parse(processedData)

      // Check for expiration
      if (parsedItem.expires && Date.now() > parsedItem.expires) {
        this.remove(key)
        return null
      }

      return parsedItem.value
    }
    catch (error) {
      this.logger.error('Storage get failed', { key, error })
      return null
    }
  }

  public remove(key: string): void {
    try {
      localStorage.removeItem(key)
    }
    catch (error) {
      this.logger.error('Storage remove failed', { key, error })
    }
  }

  public clear(): void {
    try {
      localStorage.clear()
    }
    catch (error) {
      this.logger.error('Storage clear failed', { error })
    }
  }
}

export default SecureStorageService
