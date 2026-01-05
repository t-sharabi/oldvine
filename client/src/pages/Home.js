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
  CircularProgress,
} from '@mui/material';
import {
  Hotel,
  Restaurant,
  LocationOn,
  Deck,
  BusinessCenter,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import staticData from '../utils/staticData';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState(null);
  const [roomCategories, setRoomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [homeContent, categories] = await Promise.all([
          staticData.getHomeContent(),
          staticData.getRoomCategories(),
        ]);
        setContent(homeContent);
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
    {
      icon: <BusinessCenter sx={{ fontSize: 40 }} />,
      title: t('home.feature6Title', 'Meeting Room'),
      description: t(
        'home.feature6Description',
        'A unique business-friendly setting for meetings and conferences.'
      ),
    },
  ];

  const heroImage = content?.hero?.backgroundImage || '/images/hero.jpg';

  const welcomeSection = content?.sections?.find((s) => s.sectionId === 'welcome') || {};
  const useTranslations = currentLanguage !== 'en';

  const welcomeTitle = useTranslations
    ? t('home.welcomeTitle')
    : (welcomeSection.title || t('home.welcomeTitle'));

  const welcomeSubtitle = useTranslations
    ? t('home.welcomeSubtitle')
    : (welcomeSection.subtitle || t('home.welcomeSubtitle'));

  const welcomeContent = useTranslations
    ? t('home.welcomeDescription')
    : (welcomeSection.content || t('home.welcomeDescription'));

  const roomTypes = roomCategories.map((category) => ({
    id: category._id || category.slug,
    name: category.name,
    image: category.primaryImage || '/images/room-default.jpg',
    features: category.features?.slice(0, 4) || [],
    slug: category.slug,
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const LOGO_BOTTOM = { xs: 40, sm: 55, md: 70 };

  return (
    <>
      <Helmet>
        <title>{content?.seo?.title || 'The Old Vine Hotel - Luxury Accommodation & Premium Hospitality'}</title>
        <meta
          name="description"
          content={content?.seo?.description || 'Experience luxury and elegance at The Old Vine Hotel.'}
        />
        <meta
          name="keywords"
          content={content?.seo?.keywords?.join(', ') || 'luxury hotel, premium accommodation'}
        />
      </Helmet>

      {/* Hero Section - Logo and Image Only */}

      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("${heroImage}") center/cover`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          pb: { xs: 25, md: 80},
        }}
      >
        <Container maxWidth="lg" sx={{ width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Box
                component="img"
                src="/images/logo.png"
                alt="Old Vine Hotel"
                sx={{
                  width: 'auto',
                  maxWidth: '90%',
                  maxHeight: { xs: 140, md: 250 },
                  filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.65))',
                }}
              />
            </Box>
          </motion.div>
        </Container>
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
            <Typography variant="h2" component="h2" sx={{ mb: 3, color: 'primary.main', fontWeight: 400 }}>
              {welcomeTitle}
            </Typography>

            <Typography variant="h5" component="p" sx={{ mb: 3, color: 'text.secondary', fontWeight: 300 }}>
              {welcomeSubtitle}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                whiteSpace: 'pre-line',
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
            <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: 6, color: 'primary.main' }}>
              {t('home.featuresTitle')}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 4,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(5, 1fr)',
                },
                alignItems: 'stretch',
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      p: 3,
                      border: 'none',
                      boxShadow: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, color: 'primary.main' }}>
                      {feature.icon}
                    </Box>

                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        minHeight: '2.4em',
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        minHeight: '4.8em',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              ))}
            </Box>
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
            <Typography variant="h3" component="h2" sx={{ mb: 3, color: 'primary.main' }}>
              {t('home.roomsTitle')}
            </Typography>

            <Typography variant="h6" component="p" sx={{ mb: 4, color: 'text.secondary', fontWeight: 300 }}>
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
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                    />

                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                        {room.name}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        {room.features.map((feature, idx) => (
                          <Chip
                            key={idx}
                            label={feature}
                            size="small"
                            sx={{ mr: 1, mb: 1, backgroundColor: 'primary.main', color: 'white' }}
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
