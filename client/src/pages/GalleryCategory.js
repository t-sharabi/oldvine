import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import staticData from '../utils/staticData';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageIcon from '@mui/icons-material/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const GalleryCategory = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await staticData.getGalleryCategory(categorySlug);
        setCategory(category);
      } catch (err) {
        console.error('Error loading gallery category:', err);
        setError('Failed to load gallery category. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategory();
    }
  }, [categorySlug]);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handlePrevious = () => {
    setLightboxIndex((prev) => 
      prev > 0 ? prev - 1 : (category.images.length - 1)
    );
  };

  const handleNext = () => {
    setLightboxIndex((prev) => 
      prev < category.images.length - 1 ? prev + 1 : 0
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !category) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'Category not found'}
        </Typography>
        <Button component={Link} to="/gallery" variant="contained" sx={{ mt: 2 }}>
          Back to Gallery
        </Button>
      </Container>
    );
  }

  const images = category.images || [];

  return (
    <>
      <Helmet>
        <title>{category.name} - Old Vine Hotel</title>
        <meta name="description" content={category.metaDescription || category.description} />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '40vh',
          background: category.primaryImage
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${category.primaryImage}) center/cover`
            : 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/hero.jpg") center/cover',
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
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              {category.name}
            </Typography>
            {category.description && (
              <Typography
                variant="h6"
                component="p"
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  fontWeight: 300,
                }}
              >
                {category.description}
              </Typography>
            )}
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Image Gallery Section */}
        {images.length > 0 ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                Gallery ({images.length} {images.length === 1 ? 'Image' : 'Images'})
              </Typography>
            </Box>

            {/* Main Swiper */}
            <Box sx={{ mb: 2 }}>
              <Swiper
                modules={[Navigation, Thumbs, FreeMode]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                style={{ borderRadius: 8, overflow: 'hidden' }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      component="img"
                      src={image.url}
                      alt={image.alt || `${category.name} - Image ${index + 1}`}
                      onClick={() => handleImageClick(index)}
                      sx={{
                        width: '100%',
                        height: { xs: 300, sm: 400, md: 500 },
                        objectFit: 'cover',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            {/* Thumbnail Swiper */}
            {images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Thumbs]}
                spaceBetween={10}
                slidesPerView={isMobile ? 4 : 6}
                freeMode
                watchSlidesProgress
                style={{ marginTop: 10 }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      component="img"
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => handleImageClick(index)}
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        transition: 'border-color 0.3s',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No images available for this gallery yet.
            </Typography>
          </Box>
        )}

        {/* Back Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={Link}
            to="/gallery"
            variant="outlined"
            size="large"
            sx={{ px: 4 }}
          >
            Back to All Galleries
          </Button>
        </Box>
      </Container>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={handleLightboxClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            maxWidth: '95vw',
            maxHeight: '95vh',
            m: 0,
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            onClick={handleLightboxClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 8,
                  color: 'white',
                  zIndex: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: 'white',
                  zIndex: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={lightboxIndex}
              src={images[lightboxIndex]?.url}
              alt={images[lightboxIndex]?.alt || `${category.name} - Image ${lightboxIndex + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          </AnimatePresence>

          {images.length > 1 && (
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            >
              {lightboxIndex + 1} / {images.length}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCategory;

