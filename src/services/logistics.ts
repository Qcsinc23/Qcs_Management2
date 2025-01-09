import { LogisticsItem } from '../types/logistics';

// Mock data - replace with actual API calls
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
