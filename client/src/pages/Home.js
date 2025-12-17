import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Hotel,
  Restaurant,
  FitnessCenter,
  LocationOn,
  Star,
  CheckCircle,
  Spa,
  Pool,
  BusinessCenter,
  Deck,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import staticData from '../utils/staticData';

const Home = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [content, setContent] = useState(null);
  const [roomCategories, setRoomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentLanguage = i18n.language;

  // Fetch homepage content and room categories from static data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [homeContent, categories] = await Promise.all([
          staticData.getHomeContent(),
          staticData.getRoomCategories()
        ]);
        setContent(homeContent);
        // Get first 3 categories
        setRoomCategories(categories.slice(0, 3));
      } catch (error) {
        console.error('Error loading homepage content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const features = [
    {
      icon: <Hotel sx={{ fontSize: 40 }} />,
      title: t('home.feature1Title'),
      description: t('home.feature1Description'),
    },
    {
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      title: t('home.feature2Title'),
      description: t('home.feature2Description'),
    },
    {
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      title: t('home.feature4Title'),
      description: t('home.feature4Description'),
    },
    {
      icon: <Deck sx={{ fontSize: 40 }} />,
      title: t('home.feature5Title'),
      description: t('home.feature5Description'),
    },
  ];

  // Map room categories from API to display format
  const roomTypes = roomCategories.map((category) => ({
    id: category._id || category.slug,
    name: category.name,
    image: category.primaryImage || '/images/room-default.jpg',
    price: category.priceRange?.min || 0,
    features: category.features?.slice(0, 4) || [], // Show first 4 features
    slug: category.slug,
  }));

  // Special offers - using translations
  const specialOffers = [
    {
      title: t('home.offersTitle'),
      description: t('home.offersSubtitle'),
      discount: '25% OFF',
      validUntil: '2025-12-31',
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use translations for non-English languages, static data for English
  const useTranslations = currentLanguage !== 'en';
  
  // Fallback content - prioritize translations for non-English
  const heroTitle = useTranslations ? t('hero.hotelName') : (content?.hero?.title || t('hero.hotelName'));
  const heroSubtitle = useTranslations ? t('hero.subtitle') : (content?.hero?.subtitle || t('hero.subtitle'));
  const heroDescription = useTranslations ? '' : (content?.hero?.description || '');
  const heroImage = content?.hero?.backgroundImage || '/images/hero.jpg';
  const heroCTAText = useTranslations ? t('hero.exploreRooms') : (content?.hero?.ctaText || t('hero.exploreRooms'));
  const heroCTALink = content?.hero?.ctaLink || '/rooms';

  // Get welcome section from content
  const welcomeSection = content?.sections?.find(s => s.sectionId === 'welcome') || {};
  const welcomeTitle = useTranslations ? t('home.welcomeTitle') : (welcomeSection.title || t('home.welcomeTitle'));
  const welcomeSubtitle = useTranslations ? t('home.welcomeSubtitle') : (welcomeSection.subtitle || t('home.welcomeSubtitle'));
  const welcomeContent = useTranslations ? t('home.welcomeDescription') : (welcomeSection.content || t('home.welcomeDescription'));

  return (
    <>
      <Helmet>
        <title>{content?.seo?.title || 'The Old Vine Hotel - Luxury Accommodation & Premium Hospitality'}</title>
        <meta name="description" content={content?.seo?.description || 'Experience luxury and elegance at The Old Vine Hotel.'} />
        <meta name="keywords" content={content?.seo?.keywords?.join(', ') || 'luxury hotel, premium accommodation'} />
      </Helmet>

      {/* Hero Section - Logo and Image Only */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url("${heroImage}") center/cover`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Logo Only */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <img
                src="/images/logo.png"
                alt="Old Vine Hotel"
                style={{
                  height: 'auto',
                  width: 'auto',
                  maxHeight: '200px',
                  maxWidth: '100%',
                }}
              />
            </Box>
          </motion.div>
        </Container>
        
        {/* Scroll Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'bounce 2s infinite',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            Scroll Down
          </Typography>
          <Box
            sx={{
              width: 2,
              height: 30,
              backgroundColor: 'white',
              opacity: 0.6,
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>

      {/* Welcome Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                mb: 3,
                // Use theme h2 font (Calistoga Regular - not bold)
                color: 'primary.main',
                fontWeight: 400,
              }}
            >
              {welcomeTitle}
            </Typography>
            
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 3,
                color: 'text.secondary',
                fontWeight: 300,
              }}
            >
              {welcomeSubtitle}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                whiteSpace: 'pre-line', // Preserve line breaks
              }}
            >
              {welcomeContent}
            </Typography>
          </Box>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'background.alt', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{
                mb: 6,
                color: 'primary.main',
              }}
            >
              {t('home.featuresTitle')}
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 3,
                        border: 'none',
                        boxShadow: 3,
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                          color: 'primary.main',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Rooms Preview Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 3,
                color: 'primary.main',
              }}
            >
              {t('home.roomsTitle')}
            </Typography>
            
            <Typography
              variant="h6"
              component="p"
              sx={{
                mb: 4,
                color: 'text.secondary',
                fontWeight: 300,
              }}
            >
              {t('home.roomsSubtitle')}
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {roomTypes.map((room, index) => (
              <Grid item xs={12} md={4} key={room.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ height: '100%', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height={250}
                      image={room.image}
                      alt={room.name}
                      sx={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{ mb: 2 }}
                      >
                        {room.name}
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        {room.features.map((feature, idx) => (
                          <Chip
                            key={idx}
                            label={feature}
                            size="small"
                            sx={{
                              mr: 1,
                              mb: 1,
                              backgroundColor: 'primary.main',
                              color: 'white',
                            }}
                          />
                        ))}
                      </Box>
                      
                      <Button
                        component={Link}
                        to={`/rooms/category/${room.slug || room.id}`}
                        variant="outlined"
                        fullWidth
                        sx={{ fontWeight: 600 }}
                      >
                        {t('rooms.viewDetails')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          <Box textAlign="center" sx={{ mt: 6 }}>
            <Button
              component={Link}
              to="/rooms"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4, py: 2 }}
            >
              {t('home.viewAllRooms')}
            </Button>
          </Box>
        </motion.div>
      </Container>

    </>
  );
};

export default Home;