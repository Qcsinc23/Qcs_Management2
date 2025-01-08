import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../../components/retail/payment/PaymentForm';
import PaymentSummary from '../../components/retail/payment/PaymentSummary';

interface LocationState {
  orderDetails: {
    trackingNumber: string;
    service: string;
    origin: string;
    destination: string;
    weight: string;
    dimensions: string;
  };
  pricing: {
    basePrice: number;
    insurance?: number;
    tax: number;
    discount?: number;
    total: number;
  };
}

const steps = ['Package Details', 'Review & Payment', 'Confirmation'];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const state = location.state as LocationState;

  // If no order details are provided, redirect to booking page
  if (!state?.orderDetails || !state?.pricing) {
    navigate('/retail/book');
    return null;
  }

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id);
    setActiveStep(2);
    setError(null);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleFinish = () => {
    navigate('/retail/track', {
      state: { trackingNumber: state.orderDetails.trackingNumber }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          mb: 4,
          fontWeight: 600,
        }}
      >
        Complete Your Booking
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {activeStep === 1 ? (
            <PaymentForm
              amount={state.pricing.total}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                Payment processed successfully!
              </Alert>
              <Typography variant="body1" align="center">
                Your booking has been confirmed. You can track your shipment using
                the tracking number provided in the summary.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleFinish}
                sx={{ mt: 2 }}
              >
                Track Your Shipment
              </Button>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <PaymentSummary
            orderDetails={state.orderDetails}
            pricing={state.pricing}
            paymentId={paymentId}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
