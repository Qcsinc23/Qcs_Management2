import { InventoryItem } from '../types/inventory';

// Mock data - replace with actual API calls
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Widget A',
    sku: 'WIDGET-A',
    quantity: 100,
    location: 'Warehouse 1',
    status: 'In Stock'
  },
  {
    id: '2',
    name: 'Gadget B',
    sku: 'GADGET-B',
    quantity: 50,
    location: 'Warehouse 2',
    status: 'Low Stock'
  }
];

export async function getInventory(): Promise<InventoryItem[]> {
  // Simulate network delay
  return new Promise((resolve) => 
    setTimeout(() => resolve(mockInventory), 500)
  );
}
