import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Facilities = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Hotel Facilities
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Explore our world-class amenities and services
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 4
      }}>
        <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 800 }}>
          Discover the exceptional facilities we offer to make your stay memorable.
        </Typography>
        {/* Add facilities listings here */}
      </Box>
    </Container>
  );
};

export default Facilities;