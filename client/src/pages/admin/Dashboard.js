import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Manage your hotel operations
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 4
      }}>
        <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 800 }}>
          Welcome to the admin dashboard. Here you can manage bookings, guests, rooms, and other hotel operations.
        </Typography>
        {/* Add admin dashboard components here */}
      </Box>
    </Container>
  );
};

export default AdminDashboard;