import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import {
  saveGuestBooking,
  saveGuestProgress,
  getGuestBooking,
  getGuestProgress,
} from '../../services/localStorage';
import GuestSession from './GuestSession';

interface BookingDetails {
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
    weight: string;
    dimensions: string;
    description: string;
  };
  service: {
    type: string;
    insurance: boolean;
    priority: boolean;
  };
}

const initialBookingDetails: BookingDetails = {
  pickup: {
    address: '',
    contact: '',
    phone: '',
  },
  delivery: {
    address: '',
    contact: '',
    phone: '',
  },
  package: {
    weight: '',
    dimensions: '',
    description: '',
  },
  service: {
    type: 'standard',
    insurance: false,
    priority: false,
  },
};

const serviceTypes = [
  { label: 'Standard Delivery', value: 'standard' },
  { label: 'Express Delivery', value: 'express' },
  { label: 'Same Day Delivery', value: 'same-day' },
];

const steps = ['Pickup Details', 'Delivery Details', 'Package Information', 'Service Options'];

export default function QuickBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(initialBookingDetails);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved progress on component mount
    const savedProgress = getGuestProgress();
    const savedBooking = getGuestBooking();

    if (savedProgress !== null && savedBooking) {
      setActiveStep(savedProgress);
      setBookingDetails(savedBooking.orderDetails || initialBookingDetails);
    }
  }, []);

  const calculatePricing = () => {
    // Base price calculation based on service type
    let basePrice = 20; // Standard delivery base price
    if (bookingDetails.service.type === 'express') basePrice = 35;
    if (bookingDetails.service.type === 'same-day') basePrice = 50;

    // Weight surcharge
    const weight = parseFloat(bookingDetails.package.weight);
    const weightSurcharge = weight > 5 ? (weight - 5) * 2 : 0;

    // Insurance cost
    const insuranceCost = bookingDetails.service.insurance ? basePrice * 0.1 : 0;

    // Priority handling
    const priorityCost = bookingDetails.service.priority ? basePrice * 0.15 : 0;

    // Subtotal
    const subtotal = basePrice + weightSurcharge + insuranceCost + priorityCost;

    // Tax
    const tax = subtotal * 0.08;

    // Total
    const total = subtotal + tax;

    return {
      basePrice,
      insurance: insuranceCost,
      tax,
      total,
    };
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Submit booking
      await handleSubmitBooking();
    } else {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      
      // Save progress for guest users
      if (!isSignedIn) {
        saveGuestProgress(nextStep);
        saveGuestBooking({ orderDetails: bookingDetails });
        
        // Show sign-in prompt after completing 50% of the form
        if (nextStep >= Math.floor(steps.length / 2) && !showSignInPrompt) {
          setShowSignInPrompt(true);
        }
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => {
      const newStep = prevStep - 1;
      if (!isSignedIn) {
        saveGuestProgress(newStep);
      }
      return newStep;
    });
  };

  const handleSubmitBooking = async () => {
    setIsCalculating(true);
    setError(null);
    try {
      // Generate tracking number
      const trackingNumber = Math.random().toString(36).substring(2, 12).toUpperCase();

      // Calculate pricing
      const pricing = calculatePricing();

      // Save final booking details for guest users
      if (!isSignedIn) {
        saveGuestBooking({
          trackingNumber,
          orderDetails: bookingDetails,
          pricing,
        });
      }

      // Navigate to payment page with booking details
      navigate('/retail/payment', {
        state: {
          orderDetails: {
            trackingNumber,
            service: serviceTypes.find(s => s.value === bookingDetails.service.type)?.label,
            origin: bookingDetails.pickup.address,
            destination: bookingDetails.delivery.address,
            weight: `${bookingDetails.package.weight} kg`,
            dimensions: bookingDetails.package.dimensions,
          },
          pricing,
        },
      });
    } catch (error) {
      setError('Failed to process booking. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (
    section: keyof BookingDetails,
    field: string,
    value: string | boolean
  ) => {
    setBookingDetails((prev) => {
      const newDetails = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };

      // Save progress for guest users
      if (!isSignedIn) {
        saveGuestBooking({ orderDetails: newDetails });
      }

      return newDetails;
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={[]} // Would be populated by Google Places API
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pickup Address"
                    required
                    fullWidth
                    value={bookingDetails.pickup.address}
                    onChange={(e) => handleInputChange('pickup', 'address', e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Name"
                required
                fullWidth
                value={bookingDetails.pickup.contact}
                onChange={(e) => handleInputChange('pickup', 'contact', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                required
                fullWidth
                value={bookingDetails.pickup.phone}
                onChange={(e) => handleInputChange('pickup', 'phone', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={[]} // Would be populated by Google Places API
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Delivery Address"
                    required
                    fullWidth
                    value={bookingDetails.delivery.address}
                    onChange={(e) => handleInputChange('delivery', 'address', e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Name"
                required
                fullWidth
                value={bookingDetails.delivery.contact}
                onChange={(e) => handleInputChange('delivery', 'contact', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                required
                fullWidth
                value={bookingDetails.delivery.phone}
                onChange={(e) => handleInputChange('delivery', 'phone', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Package Weight (kg)"
                required
                fullWidth
                type="number"
                value={bookingDetails.package.weight}
                onChange={(e) => handleInputChange('package', 'weight', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dimensions (LxWxH cm)"
                required
                fullWidth
                value={bookingDetails.package.dimensions}
                onChange={(e) => handleInputChange('package', 'dimensions', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Package Description"
                multiline
                rows={4}
                fullWidth
                value={bookingDetails.package.description}
                onChange={(e) => handleInputChange('package', 'description', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={serviceTypes}
                getOptionLabel={(option) => option.label}
                value={serviceTypes.find(s => s.value === bookingDetails.service.type) || serviceTypes[0]}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleInputChange('service', 'type', newValue.value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Service Type"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bookingDetails.service.insurance}
                    onChange={(e) => handleInputChange('service', 'insurance', e.target.checked)}
                  />
                }
                label="Add Shipping Insurance"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bookingDetails.service.priority}
                    onChange={(e) => handleInputChange('service', 'priority', e.target.checked)}
                  />
                }
                label="Priority Handling"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GuestSession />
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom align="center">
          Quick Booking
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {showSignInPrompt && !isSignedIn && (
          <Alert
            severity="info"
            sx={{ mb: 3 }}
            action={
              <SignInButton mode="modal">
                <Button color="inherit" size="small">
                  Sign In
                </Button>
              </SignInButton>
            }
          >
            Sign in to save your booking progress and access additional features!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              'Proceed to Payment'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </>
  );
}
