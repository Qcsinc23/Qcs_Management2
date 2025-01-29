import { Box, Paper, Typography, TextField, Grid, Button, Stepper, Step, StepLabel, CircularProgress, Autocomplete, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { useForm, Controller, useFormContext, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '../../store/useStore';
import GuestSession from './GuestSession';
import { BookingDetails } from '../../types/logistics';
import debounce from 'lodash/debounce';

// Form validation schema
const bookingSchema = z.object({
  pickup: z.object({
    address: z.string().min(5, 'Address is required'),
    contact: z.string().min(2, 'Contact name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
  }),
  delivery: z.object({
    address: z.string().min(5, 'Address is required'),
    contact: z.string().min(2, 'Contact name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
  }),
  package: z.object({
    weight: z.string().min(1, 'Weight is required'),
    dimensions: z.string().min(1, 'Dimensions are required'),
    description: z.string(),
  }),
  service: z.object({
    type: z.enum(['standard', 'express', 'same-day']),
    insurance: z.boolean(),
    priority: z.boolean(),
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const initialBookingDetails: BookingFormData = {
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
] as const;

const steps = ['Pickup Details', 'Delivery Details', 'Package Information', 'Service Options'];

interface ControllerRenderProps {
  field: {
    value: any;
    onChange: (value: any) => void;
    name: string;
  };
  fieldState: {
    error?: {
      message?: string;
    };
  };
}

// Convert BookingDetails to BookingFormData
const convertToFormData = (booking: Partial<BookingDetails>): Partial<BookingFormData> => {
  if (!booking) return {};
  return {
    ...booking,
    package: booking.package ? {
      ...booking.package,
      weight: booking.package.weight?.toString() || '',
    } : undefined,
  };
};

// Convert BookingFormData to BookingDetails
const convertToBookingData = (formData: BookingFormData): Partial<BookingDetails> => {
  return {
    ...formData,
    package: {
      ...formData.package,
      weight: parseFloat(formData.package.weight),
    },
  };
};

// Step components with validation
function PickupForm() {
  const { control } = useFormContext<BookingFormData>();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="pickup.address"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <Autocomplete
              {...field}
              freeSolo
              options={[]} // Would be populated by Google Places API
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pickup Address"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="pickup.contact"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <TextField
              {...field}
              label="Contact Name"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="pickup.phone"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <TextField
              {...field}
              label="Phone Number"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

function DeliveryForm() {
  const { control } = useFormContext<BookingFormData>();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="delivery.address"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <Autocomplete
              {...field}
              freeSolo
              options={[]} // Would be populated by Google Places API
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Delivery Address"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="delivery.contact"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <TextField
              {...field}
              label="Contact Name"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="delivery.phone"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <TextField
              {...field}
              label="Phone Number"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

function PackageForm() {
  const { control } = useFormContext<BookingFormData>();
  const calculatePrice = useStore(state => state.calculateBookingPrice);
  
  // Debounce price calculation
  const debouncedCalculate = debounce(calculatePrice, 500);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Controller
          name="package.weight"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <TextField
              {...field}
              label="Package Weight (kg)"
              required
              type="number"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              onChange={(e) => {
                field.onChange(e);
                debouncedCalculate();
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="package.dimensions"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <TextField
              {...field}
              label="Dimensions (LxWxH cm)"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="package.description"
          control={control}
          render={({ field }: ControllerRenderProps) => (
            <TextField
              {...field}
              label="Package Description"
              multiline
              rows={4}
              fullWidth
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

function ServiceForm() {
  const { control } = useFormContext<BookingFormData>();
  const calculatePrice = useStore(state => state.calculateBookingPrice);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="service.type"
          control={control}
          render={({ field, fieldState }: ControllerRenderProps) => (
            <Autocomplete
              options={serviceTypes}
              getOptionLabel={(option) => option.label}
              value={serviceTypes.find(s => s.value === field.value) || serviceTypes[0]}
              onChange={(_, newValue) => {
                if (newValue) {
                  field.onChange(newValue.value);
                  calculatePrice();
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Service Type"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="service.insurance"
          control={control}
          render={({ field }: ControllerRenderProps) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    calculatePrice();
                  }}
                />
              }
              label="Add Shipping Insurance"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="service.priority"
          control={control}
          render={({ field }: ControllerRenderProps) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    calculatePrice();
                  }}
                />
              }
              label="Priority Handling"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default function QuickBooking() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const {
    bookingStep,
    isProcessing,
    error,
    currentBooking,
    setBookingStep,
    updateBooking,
    submitBooking,
    calculateBookingPrice,
  } = useStore();

  const methods = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialBookingDetails,
  });

  // Load saved booking if exists
  useEffect(() => {
    if (currentBooking) {
      const formData = convertToFormData(currentBooking);
      methods.reset(formData as BookingFormData);
    }
  }, [currentBooking, methods]);

  // Calculate initial price when package and service details are available
  useEffect(() => {
    const booking = methods.getValues();
    if (booking.package.weight && booking.service.type) {
      calculateBookingPrice();
    }
  }, [calculateBookingPrice, methods]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      // Convert form data to BookingDetails format
      const bookingData = convertToBookingData(data);

      // Update store with final form data
      updateBooking(bookingData);
      
      // Submit booking
      if (bookingStep === steps.length - 1) {
        const bookingId = await submitBooking();
        if (bookingId) {
          navigate('/retail/payment');
        }
      } else {
        // Move to next step
        setBookingStep(bookingStep + 1);
      }
    } catch (error) {
      console.error('Booking submission failed:', error);
    }
  };

  const handleBack = () => {
    setBookingStep(Math.max(0, bookingStep - 1));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PickupForm />;
      case 1:
        return <DeliveryForm />;
      case 2:
        return <PackageForm />;
      case 3:
        return <ServiceForm />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <GuestSession />
        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom align="center">
            Quick Booking
          </Typography>

          <Stepper activeStep={bookingStep} sx={{ my: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {!isSignedIn && bookingStep >= Math.floor(steps.length / 2) && (
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

          {renderStepContent(bookingStep)}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={bookingStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <CircularProgress size={24} />
              ) : bookingStep === steps.length - 1 ? (
                'Proceed to Payment'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Paper>
      </form>
    </FormProvider>
  );
}
