import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const BookingConfirmation = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Booking Confirmation
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Your reservation has been confirmed
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 4
      }}>
        <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 800 }}>
          Thank you for your booking. You will receive a confirmation email shortly.
        </Typography>
        {/* Add booking confirmation details here */}
      </Box>
    </Container>
  );
};

export default BookingConfirmation;