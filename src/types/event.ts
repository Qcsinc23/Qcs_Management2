export interface Contact {
  id: string
  name: string
  role: 'onsite' | 'manager'
  phone: string
  email?: string
}

export interface InventoryItem {
  id: string
  name: string
  itemCode?: string // e.g., "#K10" for Pull up Banner
  quantity: number
  isAvailable: boolean
}

export interface Event {
  id: string
  name: string
  date: string
  startTime: string
  dropOffTime: string
  pickupTime: string
  venue: {
    name: string
    address: string
  }
  client: {
    name: string
    id: string
  }
  contacts: {
    onsite: Contact
    manager: Contact
  }
  items: {
    itemId: string
    quantity: number
  }[]
  additionalNotes?: string
  pickupDetails?: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateEventDTO extends Omit<Event, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  id: string
}
