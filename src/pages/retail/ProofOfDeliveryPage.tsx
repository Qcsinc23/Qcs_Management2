import { Box, Container, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ProofOfDelivery from '../../components/retail/pod/ProofOfDelivery';

interface LocationState {
  trackingNumber?: string;
  recipientName?: string;
  deliveryAddress?: string;
}

export default function ProofOfDeliveryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // If no tracking information is provided, show an error
  if (!state?.trackingNumber || !state?.recipientName || !state?.deliveryAddress) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Invalid Delivery Information
          </Typography>
          <Typography color="text.secondary">
            No valid delivery information was provided. Please try accessing this page through the tracking system.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const handleComplete = () => {
    // Navigate back to tracking page with success state
    navigate('/retail/track', {
      state: { 
        trackingNumber: state.trackingNumber, 
        confirmed: true 
      }
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
        Proof of Delivery
      </Typography>

      <Box sx={{ mb: 4 }}>
        <ProofOfDelivery
          trackingNumber={state.trackingNumber}
          recipientName={state.recipientName}
          deliveryAddress={state.deliveryAddress}
          onComplete={handleComplete}
        />
      </Box>
    </Container>
  );
}
