import React, { useState } from 'react'
import { LoggingService } from '../services/LoggingService'

interface TrackingStatus {
  status: string
  location: string
  timestamp: string
  description: string
}

const TrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingHistory, setTrackingHistory] = useState<TrackingStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const logger = LoggingService.getInstance()

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    logger.info('Tracking number submitted', { trackingNumber })

    // Simulated tracking data - replace with actual API call
    const mockTrackingData: TrackingStatus[] = [
      {
        status: 'Delivered',
        location: 'Customer Location',
        timestamp: new Date().toLocaleString(),
        description: 'Package has been delivered',
      },
      {
        status: 'Out for Delivery',
        location: 'Local Distribution Center',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
        description: 'Package is out for delivery',
      },
      {
        status: 'In Transit',
        location: 'Regional Hub',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
        description: 'Package is in transit to destination',
      },
    ]

    // Simulate API delay
    setTimeout(() => {
      setTrackingHistory(mockTrackingData)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="tracking-page">
      <h1>Track Your Delivery</h1>
      
      <div className="tracking-form-container">
        <form onSubmit={handleTrackingSubmit} className="tracking-form">
          <div className="form-group">
            <label htmlFor="trackingNumber">Tracking Number</label>
            <input
              type="text"
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="form-control"
              placeholder="Enter tracking number"
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Tracking...' : 'Track Package'}
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading tracking information...</p>
        </div>
      )}

      {!isLoading && trackingHistory.length > 0 && (
        <div className="tracking-results">
          <h2>Tracking History</h2>
          <div className="tracking-timeline">
            {trackingHistory.map((status, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-status">
                  <span className="status-dot"></span>
                  <h3>{status.status}</h3>
                </div>
                <div className="timeline-content">
                  <p className="location">{status.location}</p>
                  <p className="timestamp">{status.timestamp}</p>
                  <p className="description">{status.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackingPage