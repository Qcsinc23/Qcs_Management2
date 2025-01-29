import { LogisticsItem, BookingDetails, PricingDetails } from '../types/logistics';
import { supabase } from './supabase';

// Service types with their base prices
const SERVICE_PRICES = {
  standard: { base: 20, transitDays: 3 },
  express: { base: 35, transitDays: 2 },
  'same-day': { base: 50, transitDays: 0 }
};

// Mock data for development
const mockLogistics: LogisticsItem[] = [
  {
    shipmentId: 'SHIP-001',
    origin: 'Warehouse A',
    destination: 'Store B',
    status: 'In Transit',
    estimatedArrival: '2024-01-15',
    carrier: 'FedEx',
    trackingNumber: '1234567890'
  },
  {
    shipmentId: 'SHIP-002',
    origin: 'Warehouse B',
    destination: 'Store C',
    status: 'Delivered',
    estimatedArrival: '2024-01-10',
    carrier: 'UPS',
    trackingNumber: '0987654321'
  }
];

export async function getLogistics(): Promise<LogisticsItem[]> {
  // Simulate network delay
  return new Promise((resolve) => 
    setTimeout(() => resolve(mockLogistics), 500)
  );
}

export async function calculatePricing(
  weight: number,
  serviceType: string,
  options: { insurance: boolean; priority: boolean }
): Promise<PricingDetails> {
  const service = SERVICE_PRICES[serviceType as keyof typeof SERVICE_PRICES];
  if (!service) {
    throw new Error('Invalid service type');
  }

  // Base price from service type
  let basePrice = service.base;

  // Weight surcharge (over 5kg)
  const weightSurcharge = weight > 5 ? (weight - 5) * 2 : 0;

  // Insurance cost (10% of base price)
  const insuranceCost = options.insurance ? basePrice * 0.1 : 0;

  // Priority handling (15% of base price)
  const priorityCost = options.priority ? basePrice * 0.15 : 0;

  // Calculate subtotal
  const subtotal = basePrice + weightSurcharge + insuranceCost + priorityCost;

  // Tax (8%)
  const tax = subtotal * 0.08;

  // Total
  const total = subtotal + tax;

  return {
    basePrice,
    weightSurcharge,
    insurance: insuranceCost,
    priority: priorityCost,
    subtotal,
    tax,
    total,
    estimatedDays: service.transitDays
  };
}

export async function saveBooking(booking: BookingDetails): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
}

export function generateTrackingNumber(): string {
  const prefix = 'QCS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}
