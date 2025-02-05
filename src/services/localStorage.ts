const STORAGE_PREFIX = 'qcs_guest_'

interface GuestBooking {
  trackingNumber?: string
  orderDetails?: {
    pickup: {
      address: string
      contact: string
      phone: string
    }
    delivery: {
      address: string
      contact: string
      phone: string
    }
    package: {
      weight: string
      dimensions: string
      description: string
    }
    service: {
      type: string
      insurance: boolean
      priority: boolean
    }
  }
  pricing?: {
    basePrice: number
    insurance?: number
    tax: number
    total: number
  }
  timestamp: number
}

export function saveGuestBooking(booking: Omit<GuestBooking, 'timestamp'>) {
  try {
    const guestBooking: GuestBooking = {
      ...booking,
      timestamp: Date.now(),
    }
    localStorage.setItem(
      `${STORAGE_PREFIX}booking`,
      JSON.stringify(guestBooking),
    )
    return true
  }
  catch (error) {
    console.error('Error saving guest booking:', error)
    return false
  }
}

export function getGuestBooking(): GuestBooking | null {
  try {
    const booking = localStorage.getItem(`${STORAGE_PREFIX}booking`)
    if (!booking)
      return null

    const parsedBooking: GuestBooking = JSON.parse(booking)

    // Check if the booking is less than 24 hours old
    const isValid = Date.now() - parsedBooking.timestamp < 24 * 60 * 60 * 1000
    if (!isValid) {
      localStorage.removeItem(`${STORAGE_PREFIX}booking`)
      return null
    }

    return parsedBooking
  }
  catch (error) {
    console.error('Error getting guest booking:', error)
    return null
  }
}

export function clearGuestBooking() {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}booking`)
    return true
  }
  catch (error) {
    console.error('Error clearing guest booking:', error)
    return false
  }
}

export function saveGuestProgress(currentStep: number) {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}progress`,
      JSON.stringify({
        step: currentStep,
        timestamp: Date.now(),
      }),
    )
    return true
  }
  catch (error) {
    console.error('Error saving guest progress:', error)
    return false
  }
}

export function getGuestProgress(): number | null {
  try {
    const progress = localStorage.getItem(`${STORAGE_PREFIX}progress`)
    if (!progress)
      return null

    const parsedProgress = JSON.parse(progress)

    // Check if the progress is less than 24 hours old
    const isValid = Date.now() - parsedProgress.timestamp < 24 * 60 * 60 * 1000
    if (!isValid) {
      localStorage.removeItem(`${STORAGE_PREFIX}progress`)
      return null
    }

    return parsedProgress.step
  }
  catch (error) {
    console.error('Error getting guest progress:', error)
    return null
  }
}

export function clearGuestProgress() {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}progress`)
    return true
  }
  catch (error) {
    console.error('Error clearing guest progress:', error)
    return false
  }
}

// Function to check if there's any saved guest data
export function hasGuestData(): boolean {
  return !!(getGuestBooking() || getGuestProgress())
}

// Function to clear all guest data
export function clearAllGuestData() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    return true
  }
  catch (error) {
    console.error('Error clearing all guest data:', error)
    return false
  }
}
