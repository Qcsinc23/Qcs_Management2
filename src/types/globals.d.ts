export {}

declare global {
  interface Notification {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    duration?: number
  }

  interface CustomJwtSessionClaims {
    metadata: {
      userType?: 'retail' | 'corporate'
      onboardingComplete?: boolean
      // Retail specific metadata
      firstName?: string
      lastName?: string
      preferredContact?: 'email' | 'phone' | 'sms'
      notificationPreferences?: {
        orderUpdates: boolean
        promotions: boolean
        deliveryAlerts: boolean
      }
      // Corporate specific metadata
      companyName?: string
      companySize?: string
      industry?: string
      businessType?: string
      businessContact?: {
        businessEmail: string
        businessPhone: string
        address: string
      }
      billingPreferences?: {
        billingCycle: 'monthly' | 'quarterly' | 'annually'
        invoiceEmail: string
      }
    }
  }
}
