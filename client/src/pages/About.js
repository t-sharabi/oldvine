import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Hotel,
  Star,
  EmojiEvents,
  EmojiNature,
  Security,
  SupportAgent,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import staticData from '../utils/staticData';

const About = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentLanguage = i18n.language;

  // Fetch about page content from static data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const aboutContent = await staticData.getAboutContent();
        setContent(aboutContent);
      } catch (error) {
        console.error('Error loading about page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const values = [
    {
      icon: <Star sx={{ fontSize: 50 }} />,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, ensuring every guest experiences the finest hospitality.'
    },
    {
      icon: <SupportAgent sx={{ fontSize: 50 }} />,
      title: 'Personalized Service',
      description: 'Every guest is unique, and we tailor our services to meet individual preferences and needs.'
    },
    {
      icon: <EmojiNature sx={{ fontSize: 50 }} />,
      title: 'Sustainability',
      description: 'We are committed to environmental responsibility and sustainable practices in all our operations.'
    },
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Trust & Security',
      description: 'Your safety and privacy are our top priorities. We maintain the highest standards of security and confidentiality.'
    }
  ];


  const milestones = [
    {
      year: '1985',
      title: 'Hotel Foundation',
      description: 'The Old Vine Hotel opened its doors, beginning our journey of luxury hospitality.'
    },
    {
      year: '1995',
      title: 'Spa Addition',
      description: 'We expanded our facilities with a world-class spa and wellness center.'
    },
    {
      year: '2005',
      title: 'Luxury Renovation',
      description: 'Complete renovation elevated our accommodations to the highest luxury standards.'
    },
    {
      year: '2015',
      title: 'Sustainability Initiative',
      description: 'Launched comprehensive environmental sustainability programs.'
    },
    {
      year: '2020',
      title: 'Digital Innovation',
      description: 'Implemented cutting-edge technology for enhanced guest experiences.'
    },
    {
      year: '2025',
      title: 'Continued Excellence',
      description: 'Today, we continue to set new standards in luxury hospitality.'
    }
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
  const heroTitle = useTranslations ? t('about.heroTitle') : (content?.hero?.title || t('about.heroTitle'));
  const heroSubtitle = useTranslations ? t('about.heroSubtitle') : (content?.hero?.subtitle || t('about.heroSubtitle'));
  const heroDescription = useTranslations ? '' : (content?.hero?.description || '');
  const heroImage = content?.hero?.backgroundImage || '/images/about-hero.jpg';

  // Get sections from content - use translations for non-English
  const heritageSectionStatic = content?.sections?.find(s => s.sectionId === 'heritage') || {};
  const heritageSection = useTranslations ? {
    title: t('about.heritageTitle'),
    content: t('about.heritageContent'),
    image: heritageSectionStatic.image || '/images/about.jpg'
  } : heritageSectionStatic;
  const missionSection = content?.sections?.find(s => s.sectionId === 'mission') || {};
  const visionSection = content?.sections?.find(s => s.sectionId === 'vision') || {};
  const valuesSection = content?.sections?.find(s => s.sectionId === 'values') || {};

  return (
    <>
      <Helmet>
        <title>{content?.seo?.title || 'About Us - The Old Vine Hotel'}</title>
        <meta name="description" content={content?.seo?.description || 'Learn about The Old Vine Hotel\'s history and values.'} />
        <meta name="keywords" content={content?.seo?.keywords?.join(', ') || 'hotel, hospitality, luxury'} />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '70vh',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${heroImage}") center/cover`,
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
                // Use theme heading font
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              {heroTitle}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              {heroSubtitle}
            </Typography>
            {heroDescription && (
              <Typography
                variant="body1"
                component="p"
                sx={{
                  maxWidth: 900,
                  mx: 'auto',
                  mt: 2,
                  fontWeight: 300,
                  fontSize: '1.1rem',
                }}
              >
                {heroDescription}
              </Typography>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* About Content - Heritage Section */}
      {heritageSection.title && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    mb: 4,
                    color: 'primary.main',
                  }}
                >
                  {heritageSection.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8, 
                    fontSize: '1.1rem',
                    whiteSpace: 'pre-line' // Preserve line breaks
                  }}
                >
                  {heritageSection.content}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={heritageSection.image || '/images/about.jpg'}
                  alt={heritageSection.title || 'Hotel Interior'}
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      )}

      {/* Values Section */}
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
              {valuesSection.title || 'Our Values'}
            </Typography>
            
            {valuesSection.content && (
              <Typography
                variant="body1"
                textAlign="center"
                sx={{ mb: 6, maxWidth: 800, mx: 'auto', fontSize: '1.1rem' }}
              >
                {valuesSection.content}
              </Typography>
            )}
            
            <Grid container spacing={4}>
              {(valuesSection.items && valuesSection.items.length > 0 ? valuesSection.items : values).map((value, index) => (
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
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {value.icon && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                            color: 'primary.main',
                          }}
                        >
                          {value.icon}
                        </Box>
                      )}
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {value.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
 {false && (
  <Container maxWidth="lg" sx={{ py: 8 }}>
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
        sx={{ mb: 6, color: 'primary.main' }}
      >
        Our Journey
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'primary.main',
            transform: 'translateX(-50%)',
            display: { xs: 'none', md: 'block' },
          }}
        />

        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 6,
                flexDirection: {
                  xs: 'column',
                  md: index % 2 === 0 ? 'row' : 'row-reverse',
                },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Box sx={{ flex: 1, px: { xs: 0, md: 4 } }}>
                <Card
                  sx={{
                    p: 3,
                    maxWidth: 400,
                    mx: { xs: 'auto', md: index % 2 === 0 ? 0 : 'auto' },
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h3"
                    sx={{ color: 'secondary.main', fontWeight: 700, mb: 1 }}
                  >
                    {milestone.year}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {milestone.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {milestone.description}
                  </Typography>
                </Card>
              </Box>

              {/* Timeline dot */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: 'secondary.main',
                  borderRadius: '50%',
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: 2,
                  display: { xs: 'none', md: 'block' },
                  zIndex: 1,
                }}
              />

              <Box sx={{ flex: 1 }} />
            </Box>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  </Container>
)}

    </>
  );
};

export default About;