import type { BookingDetails, LogisticsItem, PricingDetails } from '../types/logistics'
import type { Event } from '../types/event'
import { supabase } from './supabase'

// Service types with their base prices
const SERVICE_PRICES = {
  standard: { base: 20, transitDays: 3 },
  express: { base: 35, transitDays: 2 },
  'same-day': { base: 50, transitDays: 0 },
} as const

// Helper functions
export function generateTrackingNumber(): string {
  const prefix = 'QCS'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}${random}`
}

function calculateEstimatedArrival(
  serviceType: keyof typeof SERVICE_PRICES = 'standard',
  eventDate: string,
): string {
  const service = SERVICE_PRICES[serviceType]
  const eventDateTime = new Date(eventDate)
  if (isNaN(eventDateTime.getTime())) {
    throw new Error('Invalid event date')
  }
  const deliveryDate = new Date(eventDateTime)
  deliveryDate.setDate(deliveryDate.getDate() - service.transitDays)
  return deliveryDate.toISOString().split('T')[0]
}

// Mock data for development
const mockLogistics: LogisticsItem[] = [
  {
    shipmentId: 'SHIP-001',
    origin: 'Warehouse A',
    destination: 'Store B',
    status: 'In Transit',
    estimatedArrival: '2024-01-15',
    carrier: 'FedEx',
    trackingNumber: '1234567890',
    eventId: 'EVENT-001',
  },
  {
    shipmentId: 'SHIP-002',
    origin: 'Warehouse B',
    destination: 'Store C',
    status: 'Delivered',
    estimatedArrival: '2024-01-10',
    carrier: 'UPS',
    trackingNumber: '0987654321',
    eventId: 'EVENT-002',
  },
] as LogisticsItem[]

// Service functions
export async function getLogistics(): Promise<LogisticsItem[]> {
  const { data, error } = await supabase
    .from('logistics')
    .select('*')
    .order('estimatedArrival', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch logistics: ${error.message}`)
  }

  return (data as LogisticsItem[]) || []
}

export async function getEventLogistics(eventId: string): Promise<LogisticsItem[]> {
  const { data, error } = await supabase
    .from('logistics')
    .select('*')
    .eq('eventId', eventId)
    .order('estimatedArrival', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch event logistics: ${error.message}`)
  }

  return (data as LogisticsItem[]) || []
}

export async function calculatePricing(
  weight: number,
  serviceType: keyof typeof SERVICE_PRICES,
  options: { insurance: boolean; priority: boolean },
): Promise<PricingDetails> {
  const service = SERVICE_PRICES[serviceType]
  if (!service) {
    throw new Error('Invalid service type')
  }

  // Base price from service type
  const basePrice = service.base

  // Weight surcharge (over 5kg)
  const weightSurcharge = weight > 5 ? (weight - 5) * 2 : 0

  // Insurance cost (10% of base price)
  const insuranceCost = options.insurance ? basePrice * 0.1 : 0

  // Priority handling (15% of base price)
  const priorityCost = options.priority ? basePrice * 0.15 : 0

  // Calculate subtotal
  const subtotal = basePrice + weightSurcharge + insuranceCost + priorityCost

  // Tax (8%)
  const tax = subtotal * 0.08

  // Total
  const total = subtotal + tax

  return {
    basePrice,
    weightSurcharge,
    insurance: insuranceCost,
    priority: priorityCost,
    subtotal,
    tax,
    total,
    estimatedDays: service.transitDays,
  }
}

export async function saveBooking(booking: BookingDetails): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select('id')
      .single()

    if (error) {
      throw error
    }

    if (!data?.id) {
      throw new Error('No ID returned from booking creation')
    }

    return data.id
  } catch (error) {
    console.error('Error saving booking:', error)
    throw error
  }
}

export async function createEventLogistics(
  event: Event,
  items: { itemId: string; quantity: number }[],
  service: keyof typeof SERVICE_PRICES = 'standard',
): Promise<LogisticsItem> {
  // No need to check event.id or date since they're required by the Event type
  // Just check venue properties since they're nested
  if (!event.venue?.name || !event.venue?.address) {
    throw new Error('Event must have venue details to create logistics')
  }

  const trackingNumber = generateTrackingNumber()
  const estimatedArrival = calculateEstimatedArrival(service, event.date)

  const logisticsItem: Omit<LogisticsItem, 'shipmentId'> = {
    origin: 'Main Warehouse', // Could be configurable
    destination: `${event.venue.name}, ${event.venue.address}`,
    status: 'Pending',
    estimatedArrival,
    carrier: 'Internal', // Could be configurable
    trackingNumber,
    eventId: event.id,
  }

  const { data, error } = await supabase
    .from('logistics')
    .insert([logisticsItem])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create logistics: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from logistics creation')
  }

  const result = data as LogisticsItem & { shipmentId: string }
  if (!result.shipmentId) {
    throw new Error('No shipment ID returned from logistics creation')
  }

  return result
}

export async function updateLogisticsStatus(
  shipmentId: string,
  status: LogisticsItem['status'],
): Promise<void> {
  const { error } = await supabase
    .from('logistics')
    .update({ status })
    .eq('shipmentId', shipmentId)

  if (error) {
    throw new Error(`Failed to update logistics status: ${error.message}`)
  }
}
