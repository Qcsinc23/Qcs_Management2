export interface LogisticsItem {
  shipmentId: string;
  origin: string;
  destination: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed';
  estimatedArrival: string;
  carrier: string;
  trackingNumber: string;
}

export interface BookingDetails {
  id?: string;
  trackingNumber: string;
  userId?: string;
  pickup: {
    address: string;
    contact: string;
    phone: string;
  };
  delivery: {
    address: string;
    contact: string;
    phone: string;
  };
  package: {
    weight: number;
    dimensions: string;
    description: string;
  };
  service: {
    type: 'standard' | 'express' | 'same-day';
    insurance: boolean;
    priority: boolean;
  };
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered';
  createdAt: string;
  pricing: PricingDetails;
}

export interface PricingDetails {
  basePrice: number;
  weightSurcharge: number;
  insurance: number;
  priority: number;
  subtotal: number;
  tax: number;
  total: number;
  estimatedDays: number;
}
