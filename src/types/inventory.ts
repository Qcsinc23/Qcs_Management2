export interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  location: string
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
}
