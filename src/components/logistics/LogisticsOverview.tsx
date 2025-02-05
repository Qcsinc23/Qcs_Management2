import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material'
import { getLogistics } from '../../services/logistics'
import type { LogisticsItem } from '../../types/logistics'

const LogisticsOverview: React.FC = () => {
  const [logisticsItems, setLogisticsItems] = useState<LogisticsItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        const items = await getLogistics()
        setLogisticsItems(items)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchLogistics()
  }, [])

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Logistics Overview
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="logistics table">
          <TableHead>
            <TableRow>
              <TableCell>Shipment ID</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Estimated Arrival</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Event ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logisticsItems.map((item) => (
              <TableRow key={item.shipmentId}>
                <TableCell>{item.shipmentId}</TableCell>
                <TableCell>{item.origin}</TableCell>
                <TableCell>{item.destination}</TableCell>
                <TableCell>
                  <Chip label={item.status} color="primary" />
                </TableCell>
                <TableCell>{item.estimatedArrival}</TableCell>
                <TableCell>{item.carrier}</TableCell>
                <TableCell>{item.trackingNumber}</TableCell>
                <TableCell>{item.eventId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default LogisticsOverview
