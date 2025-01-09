export interface LogisticsItem {
  shipmentId: string;
  origin: string;
  destination: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed';
  estimatedArrival: string;
  carrier: string;
  trackingNumber: string;
}
