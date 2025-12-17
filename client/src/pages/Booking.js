import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Booking = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Book Your Stay
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Reserve your room at our luxury hotel
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 4
      }}>
        <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 800 }}>
          Booking form coming soon...
        </Typography>
        {/* Add booking form here */}
      </Box>
    </Container>
  );
};

export default Booking;