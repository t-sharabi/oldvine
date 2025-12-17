import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Badge,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import staticData from '../utils/staticData';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Rooms = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await staticData.getRoomCategories();
        setCategories(categories);
      } catch (err) {
        console.error('Error loading room categories:', err);
        setError('Failed to load room categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Our Rooms - Old Vine Hotel</title>
        <meta name="description" content="Discover our luxurious room categories at Old Vine Hotel. From single rooms to suites, find the perfect accommodation for your stay in Old Damascus." />
        <meta name="keywords" content="hotel rooms, suites, luxury accommodation, damascus rooms, single room, double room, suite" />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '50vh',
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/hero.jpg") center/cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              Our Rooms & Suites
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              Discover comfort and elegance in every detail
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Category Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {categories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              No room categories available at the moment.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} md={6} key={category._id || category.slug}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    {/* Image with Badge */}
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={
                          category.primaryImage || '/images/room-default.jpg'
                        }
                        alt={category.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      {/* Image Count Badge */}
                      {category.imageCount > 0 && (
                        <Badge
                          badgeContent={category.imageCount}
                          color="primary"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            '& .MuiBadge-badge': {
                              fontSize: '0.875rem',
                              padding: '4px 8px',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '50%',
                              p: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ImageIcon color="primary" />
                          </Box>
                        </Badge>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 2 }}
                      >
                        {category.name}
                      </Typography>
                      
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, minHeight: 60 }}
                      >
                        {category.shortDescription || category.description}
                      </Typography>

                      {/* Features */}
                      {category.features && category.features.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          {category.features.slice(0, 4).map((feature, idx) => (
                            <Chip
                              key={idx}
                              label={feature}
                              size="small"
                              sx={{
                                mr: 1,
                                mb: 1,
                                backgroundColor: 'primary.light',
                                color: 'white',
                              }}
                            />
                          ))}
                          {category.features.length > 4 && (
                            <Chip
                              label={`+${category.features.length - 4} more`}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                          )}
                        </Box>
                      )}

                      {/* Stats */}
                      <Box sx={{ mb: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {category.roomCount > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            {category.roomCount} {category.roomCount === 1 ? 'Room' : 'Rooms'} Available
                          </Typography>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        component={Link}
                        to={`/rooms/category/${category.slug}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        startIcon={<VisibilityIcon />}
                        sx={{ fontWeight: 600, py: 1.5 }}
                      >
                        View Gallery
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Ready to Book?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Contact us to reserve your perfect room
          </Typography>
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4, py: 2 }}
          >
            Contact Us
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Rooms;
