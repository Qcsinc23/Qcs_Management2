import type { ReportItem } from '../types/reports'

// Mock data - replace with actual API calls
const mockReports: ReportItem[] = [
  {
    id: '1',
    type: 'Sales',
    period: '2023-10',
    generatedAt: '2023-10-15T08:00:00Z',
    status: 'Ready',
    downloadUrl: '#',
  },
  {
    id: '2',
    type: 'Inventory',
    period: '2023-09',
    generatedAt: '2023-09-15T08:00:00Z',
    status: 'Ready',
    downloadUrl: '#',
  },
]

export async function getReports(): Promise<ReportItem[]> {
  // Simulate network delay
  return new Promise(resolve =>
    setTimeout(() => resolve(mockReports), 500),
  )
}

export async function generateReport(type: string, period: string): Promise<ReportItem> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReport = {
        id: String(mockReports.length + 1),
        type,
        period,
        generatedAt: new Date().toISOString(),
        status: 'Pending',
        downloadUrl: '#',
      }
      mockReports.unshift(newReport)
      resolve(newReport)
    }, 500)
  })
}
