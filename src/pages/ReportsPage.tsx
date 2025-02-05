import React, { useState } from 'react'
import { LoggingService } from '../services/LoggingService'

interface DeliveryMetrics {
  totalDeliveries: number
  completedDeliveries: number
  pendingDeliveries: number
  successRate: number
}

interface RevenueData {
  period: string
  amount: number
}

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('week')
  const logger = LoggingService.getInstance()

  // Mock metrics data - replace with actual API data
  const metrics: DeliveryMetrics = {
    totalDeliveries: 1250,
    completedDeliveries: 1180,
    pendingDeliveries: 70,
    successRate: 94.4,
  }

  // Mock revenue data - replace with actual API data
  const revenueData: RevenueData[] = [
    { period: 'Monday', amount: 12500 },
    { period: 'Tuesday', amount: 15000 },
    { period: 'Wednesday', amount: 13750 },
    { period: 'Thursday', amount: 14200 },
    { period: 'Friday', amount: 16800 },
    { period: 'Saturday', amount: 11900 },
    { period: 'Sunday', amount: 9500 },
  ]

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
    logger.info('Reports date range changed', { range })
    // Add API call to fetch new data based on range
  }

  const handleExport = (format: 'pdf' | 'csv') => {
    logger.info('Exporting report', { format, dateRange })
    // Add export logic
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Analytics & Reports</h1>
        <div className="reports-controls">
          <div className="date-range-selector">
            <button
              className={dateRange === 'week' ? 'active' : ''}
              onClick={() => handleDateRangeChange('week')}
            >
              Week
            </button>
            <button
              className={dateRange === 'month' ? 'active' : ''}
              onClick={() => handleDateRangeChange('month')}
            >
              Month
            </button>
            <button
              className={dateRange === 'year' ? 'active' : ''}
              onClick={() => handleDateRangeChange('year')}
            >
              Year
            </button>
          </div>
          <div className="export-controls">
            <button onClick={() => handleExport('pdf')}>Export PDF</button>
            <button onClick={() => handleExport('csv')}>Export CSV</button>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Deliveries</h3>
          <p className="metric-value">{metrics.totalDeliveries}</p>
        </div>
        <div className="metric-card">
          <h3>Completed</h3>
          <p className="metric-value">{metrics.completedDeliveries}</p>
        </div>
        <div className="metric-card">
          <h3>Pending</h3>
          <p className="metric-value">{metrics.pendingDeliveries}</p>
        </div>
        <div className="metric-card">
          <h3>Success Rate</h3>
          <p className="metric-value">{metrics.successRate}%</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-section">
          <h2>Revenue Overview</h2>
          <div className="revenue-chart">
            <table className="revenue-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.period}</td>
                    <td>${data.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="report-section">
          <h2>Top Performing Areas</h2>
          <div className="performance-list">
            <div className="performance-item">
              <span className="area">Downtown</span>
              <span className="value">32% of deliveries</span>
            </div>
            <div className="performance-item">
              <span className="area">Suburban North</span>
              <span className="value">28% of deliveries</span>
            </div>
            <div className="performance-item">
              <span className="area">Business District</span>
              <span className="value">25% of deliveries</span>
            </div>
            <div className="performance-item">
              <span className="area">Suburban South</span>
              <span className="value">15% of deliveries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage