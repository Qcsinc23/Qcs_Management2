import { supabase } from './supabase'
import type { Event, CreateEventDTO, UpdateEventDTO } from '../types/event'
import { validateEventData, validateEventTimes, EventValidationError } from '../utils/eventValidation'
import { LoggingService } from './LoggingService'

const EVENTS_TABLE = 'events'
const logger = LoggingService.getInstance()

export class EventError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'EventError'
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      logger.error('Failed to fetch events from database', { error })
      throw new EventError(`Failed to fetch events: ${error.message}`, error)
    }

    logger.debug('Successfully fetched events', { count: data?.length || 0 })
    return data || []
  } catch (err) {
    const error = err as Error
    logger.error('Unexpected error fetching events', { error })
    throw new EventError('Failed to fetch events', error)
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    if (!id) {
      throw new EventValidationError('Event ID is required')
    }

    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logger.error('Failed to fetch event from database', { error, eventId: id })
      throw new EventError(`Failed to fetch event: ${error.message}`, error)
    }

    if (!data) {
      logger.warn('Event not found', { eventId: id })
      return null
    }

    logger.debug('Successfully fetched event', { eventId: id })
    return data
  } catch (err) {
    if (err instanceof EventValidationError) {
      throw err
    }
    const error = err as Error
    logger.error('Unexpected error fetching event', { error, eventId: id })
    throw new EventError('Failed to fetch event', error)
  }
}

export async function createEvent(event: CreateEventDTO): Promise<Event> {
  try {
    // Validate event data
    validateEventData(event)
    validateEventTimes(event.startTime, event.dropOffTime, event.pickupTime)

    // Check for scheduling conflicts
    const hasConflict = await checkSchedulingConflicts(
      event.date,
      event.dropOffTime,
      event.pickupTime
    )

    if (hasConflict) {
      throw new EventValidationError('Scheduling conflict detected')
    }

    const newEvent = {
      ...event,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .insert([newEvent])
      .select()
      .single()

    if (error) {
      logger.error('Failed to create event in database', {
        error,
        eventData: newEvent,
      })
      throw new EventError(`Failed to create event: ${error.message}`, error)
    }

    logger.info('Event created successfully', { eventId: data.id })
    return data
  } catch (err) {
    if (err instanceof EventValidationError) {
      throw err
    }
    const error = err as Error
    logger.error('Unexpected error creating event', {
      error,
      eventData: event,
    })
    throw new EventError('Failed to create event', error)
  }
}

export async function updateEvent(event: UpdateEventDTO): Promise<Event> {
  try {
    // Validate partial update data
    if (event.startTime || event.dropOffTime || event.pickupTime) {
      const currentEvent = await getEventById(event.id)
      if (!currentEvent) {
        throw new EventError('Event not found')
      }

      validateEventTimes(
        event.startTime || currentEvent.startTime,
        event.dropOffTime || currentEvent.dropOffTime,
        event.pickupTime || currentEvent.pickupTime
      )

      // Check for scheduling conflicts
      const hasConflict = await checkSchedulingConflicts(
        event.date || currentEvent.date,
        event.dropOffTime || currentEvent.dropOffTime,
        event.pickupTime || currentEvent.pickupTime,
        event.id
      )

      if (hasConflict) {
        throw new EventValidationError('Scheduling conflict detected')
      }
    }

    const updates = {
      ...event,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .update(updates)
      .eq('id', event.id)
      .select()
      .single()

    if (error) {
      logger.error('Failed to update event in database', {
        error,
        eventId: event.id,
        updates,
      })
      throw new EventError(`Failed to update event: ${error.message}`, error)
    }

    logger.info('Event updated successfully', { eventId: data.id })
    return data
  } catch (err) {
    if (err instanceof EventValidationError) {
      throw err
    }
    const error = err as Error
    logger.error('Unexpected error updating event', {
      error,
      eventId: event.id,
      updates: event,
    })
    throw new EventError('Failed to update event', error)
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    if (!id) {
      throw new EventValidationError('Event ID is required')
    }

    // Check if event exists and is deletable
    const event = await getEventById(id)
    if (!event) {
      throw new EventValidationError('Event not found')
    }
    
    if (event.status === 'completed') {
      throw new EventValidationError('Cannot delete completed events')
    }

    const { error } = await supabase
      .from(EVENTS_TABLE)
      .delete()
      .eq('id', id)

    if (error) {
      logger.error('Failed to delete event from database', { error, eventId: id })
      throw new EventError(`Failed to delete event: ${error.message}`, error)
    }

    logger.info('Event deleted successfully', { eventId: id })
  } catch (err) {
    if (err instanceof EventValidationError) {
      throw err
    }
    const error = err as Error
    logger.error('Unexpected error deleting event', { error, eventId: id })
    throw new EventError('Failed to delete event', error)
  }
}

export async function checkSchedulingConflicts(
  date: string,
  dropOffTime: string,
  pickupTime: string,
  excludeEventId?: string,
): Promise<boolean> {
  try {
    // Validate inputs
    if (!date || !dropOffTime || !pickupTime) {
      throw new EventValidationError('Date, drop-off time, and pickup time are required')
    }

    // Validate time format and logic
    validateEventTimes(dropOffTime, dropOffTime, pickupTime)

    const { data: conflictingEvents, error } = await supabase
      .from(EVENTS_TABLE)
      .select('id, dropOffTime, pickupTime')
      .eq('date', date)
      .not('id', 'eq', excludeEventId || '')
      .not('status', 'eq', 'cancelled') // Don't check cancelled events

    if (error) {
      logger.error('Failed to check scheduling conflicts', {
        error,
        date,
        dropOffTime,
        pickupTime,
      })
      throw new EventError(`Failed to check scheduling conflicts: ${error.message}`, error)
    }

    if (!conflictingEvents?.length) {
      return false
    }

    const newEventStart = new Date(`${date}T${dropOffTime}`)
    const newEventEnd = new Date(`${date}T${pickupTime}`)

    const hasConflict = conflictingEvents.some((event) => {
      const existingStart = new Date(`${date}T${event.dropOffTime}`)
      const existingEnd = new Date(`${date}T${event.pickupTime}`)

      return (
        (newEventStart >= existingStart && newEventStart < existingEnd)
        || (newEventEnd > existingStart && newEventEnd <= existingEnd)
        || (newEventStart <= existingStart && newEventEnd >= existingEnd)
      )
    })

    logger.debug('Scheduling conflict check completed', {
      date,
      hasConflict,
      conflictCount: conflictingEvents.length,
    })

    return hasConflict
  } catch (err) {
    if (err instanceof EventValidationError) {
      throw err
    }
    const error = err as Error
    logger.error('Unexpected error checking scheduling conflicts', {
      error,
      date,
      dropOffTime,
      pickupTime,
    })
    throw new EventError('Failed to check scheduling conflicts', error)
  }
}

export async function getEventsByDateRange(
  startDate: string,
  endDate: string,
): Promise<Event[]> {
  try {
    if (!startDate || !endDate) {
      throw new EventValidationError('Start date and end date are required')
    }

    // Validate date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new EventValidationError('Invalid date format')
    }
    if (start > end) {
      throw new EventValidationError('Start date must be before or equal to end date')
    }

    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) {
      logger.error('Failed to fetch events by date range', {
        error,
        startDate,
        endDate,
      })
      throw new EventError(`Failed to fetch events by date range: ${error.message}`, error)
    }

    logger.debug('Successfully fetched events by date range', {
      startDate,
      endDate,
      count: data?.length || 0,
    })

    return data || []
  } catch (err) {
    if (err instanceof EventValidationError) {
      throw err
    }
    const error = err as Error
    logger.error('Unexpected error fetching events by date range', {
      error,
      startDate,
      endDate,
    })
    throw new EventError('Failed to fetch events by date range', error)
  }
}
