import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  hasGuestData,
  getGuestBooking,
  clearAllGuestData,
} from '../../services/localStorage';

interface GuestSessionProps {
  onContinueAsGuest?: () => void;
}

export default function GuestSession({ onContinueAsGuest }: GuestSessionProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing guest data when component mounts
    if (hasGuestData()) {
      setShowDialog(true);
    }
  }, []);

  const handleContinueBooking = () => {
    setIsLoading(true);
    try {
      const savedBooking = getGuestBooking();
      if (savedBooking) {
        // If there's a saved booking, navigate to the appropriate step
        if (savedBooking.trackingNumber) {
          navigate('/retail/payment', {
            state: {
              orderDetails: savedBooking.orderDetails,
              pricing: savedBooking.pricing,
            },
          });
        } else {
          navigate('/retail/book');
        }
      }
    } catch (error) {
      console.error('Error restoring guest session:', error);
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  const handleStartNew = () => {
    setIsLoading(true);
    try {
      clearAllGuestData();
      if (onContinueAsGuest) {
        onContinueAsGuest();
      }
    } catch (error) {
      console.error('Error clearing guest data:', error);
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Welcome Back!</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          We noticed you have a saved booking. Would you like to continue where you left off?
        </Alert>
        <Typography variant="body1" gutterBottom>
          You can either:
        </Typography>
        <Box component="ul" sx={{ mt: 1, mb: 2 }}>
          <Typography component="li">Continue your previous booking</Typography>
          <Typography component="li">Start a new booking</Typography>
          <Typography component="li">Sign in to save your progress</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Note: Guest bookings are saved for 24 hours. Create an account to keep your booking history permanently.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', p: 3, gap: 1 }}>
        <Button
          onClick={handleContinueBooking}
          variant="contained"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Continue Previous Booking'}
        </Button>
        <Button
          onClick={handleStartNew}
          variant="outlined"
          fullWidth
          disabled={isLoading}
        >
          Start New Booking
        </Button>
        <SignInButton mode="modal">
          <Button
            variant="text"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 1 }}
          >
            Sign In to Save Progress
          </Button>
        </SignInButton>
      </DialogActions>
    </Dialog>
  );
}
