import type { BookingDetails } from '../types/logistics'
import { create } from 'zustand'
import { calculatePricing, generateTrackingNumber, saveBooking } from '../services/logistics'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface Event {
  id: string
  title: string
  date: Date
  status: 'upcoming' | 'in-progress' | 'completed'
}

interface Delivery {
  id: string
  destination: string
  status: 'pending' | 'in-transit' | 'delivered'
  estimatedArrival: Date
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  timestamp: Date
  read: boolean
}

interface BookingState {
  currentBooking: Partial<BookingDetails> | null
  bookingStep: number
  isProcessing: boolean
  error: string | null
}

interface StoreState extends BookingState {
  // Events
  events: Event[]
  setEvents: (events: Event[]) => void
  addEvent: (event: Omit<Event, 'id'>) => void
  updateEvent: (id: string, event: Partial<Event>) => void

  // Active Deliveries
  activeDeliveries: Delivery[]
  setDeliveries: (deliveries: Delivery[]) => void
  updateDeliveryStatus: (id: string, status: Delivery['status']) => void

  // UI State
  sidebarOpen: boolean
  toggleSidebar: () => void

  // Chat Messages
  chatMessages: Message[]
  addChatMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  clearChatMessages: () => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void

  // Booking Actions
  setBookingStep: (step: number) => void
  updateBooking: (update: Partial<BookingDetails>) => void
  calculateBookingPrice: () => Promise<void>
  submitBooking: () => Promise<string>
  resetBooking: () => void
}

const initialBookingState: BookingState = {
  currentBooking: null,
  bookingStep: 0,
  isProcessing: false,
  error: null,
}

const useStore = create<StoreState>((set, get) => ({
  // Initial booking state
  ...initialBookingState,
  // Events
  events: [],
  setEvents: events => set({ events }),
  addEvent: event =>
    set(state => ({
      events: [
        ...state.events,
        { ...event, id: Math.random().toString(36).substring(7) },
      ],
    })),
  updateEvent: (id, eventUpdate) =>
    set(state => ({
      events: state.events.map(event =>
        event.id === id ? { ...event, ...eventUpdate } : event,
      ),
    })),

  // Active Deliveries
  activeDeliveries: [],
  setDeliveries: deliveries => set({ activeDeliveries: deliveries }),
  updateDeliveryStatus: (id, status) =>
    set(state => ({
      activeDeliveries: state.activeDeliveries.map(delivery =>
        delivery.id === id ? { ...delivery, status } : delivery,
      ),
    })),

  // UI State
  sidebarOpen: false,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  // Chat Messages
  chatMessages: [],
  addChatMessage: message =>
    set(state => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
      ],
    })),
  clearChatMessages: () => set({ chatMessages: [] }),

  // Notifications
  notifications: [],
  addNotification: notification =>
    set(state => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
          read: false,
        },
      ],
    })),
  markNotificationAsRead: id =>
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),

  // Booking Actions
  setBookingStep: step => set({ bookingStep: step }),

  updateBooking: update => set(state => ({
    currentBooking: {
      ...state.currentBooking,
      ...update,
    },
    error: null,
  })),

  calculateBookingPrice: async () => {
    const state = get()
    const booking = state.currentBooking

    if (!booking?.package?.weight || !booking?.service?.type) {
      return
    }

    try {
      set({ isProcessing: true, error: null })
      const pricing = await calculatePricing(
        Number(booking.package.weight),
        booking.service.type,
        {
          insurance: booking.service.insurance || false,
          priority: booking.service.priority || false,
        },
      )
      set(state => ({
        currentBooking: {
          ...state.currentBooking,
          pricing,
        },
      }))
    }
    catch (error) {
      set({ error: 'Failed to calculate pricing' })
    }
    finally {
      set({ isProcessing: false })
    }
  },

  submitBooking: async () => {
    const state = get()
    const booking = state.currentBooking as BookingDetails

    if (!booking) {
      throw new Error('No booking details available')
    }

    try {
      set({ isProcessing: true, error: null })

      // Generate tracking number if not exists
      if (!booking.trackingNumber) {
        booking.trackingNumber = generateTrackingNumber()
      }

      // Set creation timestamp
      booking.createdAt = new Date().toISOString()

      // Set initial status
      booking.status = 'pending'

      // Save to Supabase
      const bookingId = await saveBooking(booking)

      // Reset booking state
      set(initialBookingState)

      return bookingId
    }
    catch (error) {
      set({ error: 'Failed to submit booking' })
      throw error
    }
    finally {
      set({ isProcessing: false })
    }
  },

  resetBooking: () => set(initialBookingState),
}))

export default useStore
