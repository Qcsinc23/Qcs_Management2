import { Box, Typography, Container } from '@mui/material';
import QuickBooking from '../../components/retail/QuickBooking';

export default function Book() {
  return (
    <Box>
      <Container maxWidth="lg">
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
          Book Your Delivery
        </Typography>
        <QuickBooking />
      </Container>
    </Box>
  );
}