import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  LocalShipping as TruckIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface TrackingStatus {
  status: 'pickup' | 'in-transit' | 'out-for-delivery' | 'delivered'
  location: string
  timestamp: string
  description: string
}

interface TrackingDetails {
  trackingNumber: string
  status: TrackingStatus
  estimatedDelivery: string
  driverName?: string
  driverPhone?: string
  recipientName?: string
  deliveryAddress?: string
}

const mockTrackingSteps = [
  {
    label: 'Picked Up',
    description: 'Package collected from sender',
  },
  {
    label: 'In Transit',
    description: 'Package in transit to destination',
  },
  {
    label: 'Out for Delivery',
    description: 'Package out for delivery',
  },
  {
    label: 'Delivered',
    description: 'Package delivered successfully',
  },
]

function getStepNumber(status: TrackingStatus['status']) {
  const statusMap = {
    'pickup': 0,
    'in-transit': 1,
    'out-for-delivery': 2,
    'delivered': 3,
  }
  return statusMap[status]
}

export default function PackageTracking() {
  const navigate = useNavigate()
  const location = useLocation()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingDetails, setTrackingDetails] = useState<TrackingDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if we have a tracking number from the location state
  useEffect(() => {
    const state = location.state as { trackingNumber?: string }
    if (state?.trackingNumber) {
      setTrackingNumber(state.trackingNumber)
      void handleTrackPackage(state.trackingNumber)
    }
  }, [])

  const handleTrackPackage = async (number: string = trackingNumber) => {
    if (!number.trim()) {
      setError('Please enter a tracking number')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock tracking details
      const mockDetails: TrackingDetails = {
        trackingNumber: number,
        status: {
          status: 'out-for-delivery',
          location: 'Distribution Center, New York',
          timestamp: new Date().toISOString(),
          description: 'Package is out for delivery',
        },
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        driverName: 'John Smith',
        driverPhone: '+1 (555) 123-4567',
        recipientName: 'Jane Doe',
        deliveryAddress: '123 Main St, New York, NY 10001',
      }

      setTrackingDetails(mockDetails)
      setError(null)
    }
    catch (error) {
      setError('Failed to fetch tracking information. Please try again.')
    }
  }

  const handleContactDriver = () => {
    // In a real implementation, this would integrate with a communication service
    window.location.href = `tel:${trackingDetails?.driverPhone}`
  }

  const handleConfirmDelivery = () => {
    if (trackingDetails) {
      void navigate('/retail/pod', {
        state: {
          trackingNumber: trackingDetails.trackingNumber,
          recipientName: trackingDetails.recipientName,
          deliveryAddress: trackingDetails.deliveryAddress,
        },
      })
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Track Your Package
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Tracking Number"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            onClick={() => void handleTrackPackage()}
            sx={{ minWidth: 120 }}
          >
            Track
          </Button>
        </Box>

        {trackingDetails && (
          <Box>
            <Stepper
              activeStep={getStepNumber(trackingDetails.status.status)}
              alternativeLabel
            >
              {mockTrackingSteps.map(step => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Current Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 1 }} />
                      <Typography>{trackingDetails.status.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimeIcon sx={{ mr: 1 }} />
                      <Typography>
                        Last Updated:
                        {' '}
                        {new Date(trackingDetails.status.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TruckIcon sx={{ mr: 1 }} />
                      <Typography>
                        Estimated Delivery:
                        {' '}
                        {trackingDetails.estimatedDelivery}
                      </Typography>
                    </Box>

                    {trackingDetails.status.status === 'out-for-delivery' && (
                      <Box sx={{ mt: 3 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<VerifiedIcon />}
                          onClick={handleConfirmDelivery}
                          fullWidth
                        >
                          Confirm Delivery
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Driver Information
                    </Typography>
                    {trackingDetails.driverName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        <Typography>{trackingDetails.driverName}</Typography>
                      </Box>
                    )}
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleContactDriver}
                      disabled={!trackingDetails.driverPhone}
                    >
                      Contact Driver
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Alert severity="info">
                Your package is on track for delivery by
                {' '}
                {trackingDetails.estimatedDelivery}
              </Alert>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
