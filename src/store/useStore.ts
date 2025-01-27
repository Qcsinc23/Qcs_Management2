import { create } from 'zustand';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface Delivery {
  id: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered';
  estimatedArrival: Date;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface StoreState {
  // Events
  events: Event[];
  setEvents: (events: Event[]) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;

  // Active Deliveries
  activeDeliveries: Delivery[];
  setDeliveries: (deliveries: Delivery[]) => void;
  updateDeliveryStatus: (id: string, status: Delivery['status']) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Chat Messages
  chatMessages: Message[];
  addChatMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearChatMessages: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const useStore = create<StoreState>((set) => ({
  // Events
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        { ...event, id: Math.random().toString(36).substring(7) },
      ],
    })),
  updateEvent: (id, eventUpdate) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...eventUpdate } : event
      ),
    })),

  // Active Deliveries
  activeDeliveries: [],
  setDeliveries: (deliveries) => set({ activeDeliveries: deliveries }),
  updateDeliveryStatus: (id, status) =>
    set((state) => ({
      activeDeliveries: state.activeDeliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status } : delivery
      ),
    })),

  // UI State
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Chat Messages
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
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
  addNotification: (notification) =>
    set((state) => ({
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
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

export default useStore;
