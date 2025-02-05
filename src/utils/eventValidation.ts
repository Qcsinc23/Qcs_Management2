import type { CreateEventDTO, Event } from '../types/event'

export class EventValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EventValidationError'
  }
}

export function validateEventTimes(
  startTime: string,
  dropOffTime: string,
  pickupTime: string
): void {
  const start = new Date(`2000-01-01T${startTime}`)
  const dropOff = new Date(`2000-01-01T${dropOffTime}`)
  const pickup = new Date(`2000-01-01T${pickupTime}`)

  if (dropOff >= pickup) {
    throw new EventValidationError('Drop-off time must be before pickup time')
  }

  if (start > dropOff) {
    throw new EventValidationError('Start time must be before or equal to drop-off time')
  }
}

export function validateEventData(data: Partial<CreateEventDTO>): void {
  // Required fields
  const requiredFields = [
    'name',
    'date',
    'startTime',
    'dropOffTime',
    'pickupTime',
    'venue',
    'client',
    'contacts',
    'status'
  ]

  for (const field of requiredFields) {
    if (!data[field as keyof CreateEventDTO]) {
      throw new EventValidationError(`Missing required field: ${field}`)
    }
  }

  // Validate venue
  if (!data.venue?.name || !data.venue?.address) {
    throw new EventValidationError('Venue must include both name and address')
  }

  // Validate client
  if (!data.client?.name) {
    throw new EventValidationError('Client name is required')
  }

  // Validate contacts
  if (!data.contacts?.onsite?.name || !data.contacts?.onsite?.phone) {
    throw new EventValidationError('On-site contact must include name and phone')
  }
  if (!data.contacts?.manager?.name || !data.contacts?.manager?.phone) {
    throw new EventValidationError('Manager contact must include name and phone')
  }

  // Validate times
  validateEventTimes(data.startTime!, data.dropOffTime!, data.pickupTime!)

  // Validate date
  const eventDate = new Date(data.date!)
  if (isNaN(eventDate.getTime())) {
    throw new EventValidationError('Invalid date format')
  }

  // Validate status
  const validStatuses = ['scheduled', 'in-progress', 'completed', 'cancelled']
  if (data.status && !validStatuses.includes(data.status)) {
    throw new EventValidationError('Invalid status value')
  }

  // Validate items if present
  if (data.items) {
    for (const item of data.items) {
      if (!item.itemId || typeof item.quantity !== 'number' || item.quantity < 0) {
        throw new EventValidationError('Invalid item data')
      }
    }
  }
}

export function formatEventDuration(event: Event): string {
  const start = new Date(`2000-01-01T${event.startTime}`)
  const end = new Date(`2000-01-01T${event.pickupTime}`)
  const durationMs = end.getTime() - start.getTime()
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

export function isEventEditable(event: Event): boolean {
  return !['completed', 'cancelled'].includes(event.status)
}

export function isEventViewable(event: Event): boolean {
  return event.status !== 'cancelled'
}