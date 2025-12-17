import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  WhatsApp,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const quickLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.rooms'), path: '/rooms' },
    { label: t('nav.facilities'), path: '/facilities' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com/oldvinehotel', label: 'Facebook' },
    { icon: <Instagram />, url: 'https://instagram.com/oldvinehotel', label: 'Instagram' },
    { icon: <Twitter />, url: 'https://twitter.com/oldvinehotel', label: 'Twitter' },
    { icon: <LinkedIn />, url: 'https://linkedin.com/company/oldvinehotel', label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Hotel Information */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.secondary.main,
                }}
              >
                The Old Vine Hotel
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.7 }}>
                {t('footer.description')}
              </Typography>
              
              {/* Social Media Links */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.main,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ mb: 2, fontWeight: 600, color: theme.palette.secondary.main }}
              >
                {t('footer.quickLinks')}
              </Typography>
              <Box component="nav">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      mb: 1,
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ mb: 2, fontWeight: 600, color: theme.palette.secondary.main }}
              >
                {t('footer.contactInfo')}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Old Damascus City
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  0112241609
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  reservations@oldvinehotel.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WhatsApp sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  +963986105010
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Newsletter Signup */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ mb: 2, fontWeight: 600, color: theme.palette.secondary.main }}
              >
                {t('footer.newsletter')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {t('footer.newsletterText')}
              </Typography>
              
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  placeholder={t('footer.emailPlaceholder')}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.secondary.main,
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {t('footer.subscribe')}
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            © {new Date().getFullYear()} The Old Vine Hotel. {t('footer.rights')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.secondary.main,
                },
              }}
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.secondary.main,
                },
              }}
            >
              {t('footer.terms')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;