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
  CircularProgress,
  Badge,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import staticData from '../utils/staticData';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Gallery = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await staticData.getGalleryCategories();
        setCategories(categories);
      } catch (err) {
        console.error('Error loading gallery categories:', err);
        setError('Failed to load gallery categories. Please try again later.');
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
        <title>Photo Gallery - Old Vine Hotel</title>
        <meta name="description" content="Explore our photo galleries showcasing the beautiful hotel interiors, restaurant, and dining experiences at Old Vine Hotel." />
        <meta name="keywords" content="hotel gallery, restaurant gallery, photo gallery, damascus hotel photos" />
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
              Photo Gallery
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
              A glimpse of our beautiful hotel and surroundings
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Category Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {categories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              No gallery categories available at the moment.
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
                          category.primaryImage || '/images/gallery-default.jpg'
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
                        sx={{ mb: 3 }}
                      >
                        {category.shortDescription || category.description}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        component={Link}
                        to={`/gallery/${category.slug}`}
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
      </Container>
    </>
  );
};

export default Gallery;
