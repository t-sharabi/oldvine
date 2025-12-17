import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const Contact = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch contact information
  const { data: contactInfo } = useQuery(
    'contactInfo',
    () => axios.get('/api/contact/info').then(res => res.data.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Submit contact form
  const submitContactForm = useMutation(
    (formData) => axios.post('/api/contact', formData),
    {
      onSuccess: () => {
        setSubmitStatus({ type: 'success', message: t('contact.messageSent') });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      },
      onError: (error) => {
        setSubmitStatus({
          type: 'error',
          message: error.response?.data?.message || 'Failed to send message'
        });
      }
    }
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      submitContactForm.mutate(formData);
    }
  };

  const contactCards = [
    {
      title: 'Phone',
      icon: <Phone sx={{ fontSize: 40 }} />,
      primary: '0112241609',
      secondary: '24/7 Available',
      action: 'tel:0112241609'
    },
    {
      title: 'Email',
      icon: <Email sx={{ fontSize: 40 }} />,
      primary: 'reservations@oldvinehotel.com',
      secondary: 'Response within 24 hours',
      action: 'mailto:reservations@oldvinehotel.com'
    },
    {
      title: 'WhatsApp',
      icon: <WhatsApp sx={{ fontSize: 40 }} />,
      primary: '+963986105010',
      secondary: 'Quick responses',
      action: 'https://wa.me/963986105010'
    },
    {
      title: 'Address',
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      primary: contactInfo?.hotel?.address?.formatted || 'Old Damascus City',
      secondary: t('contact.directions'),
      action: 'https://maps.google.com/?q=' + encodeURIComponent(contactInfo?.hotel?.address?.formatted || 'Old Damascus City')
    }
  ];

  const departments = [
    {
      name: 'Reservations',
      phone: contactInfo?.departments?.reservations?.phone || '+1 (555) 123-4567',
      email: contactInfo?.departments?.reservations?.email || 'reservations@oldvinehotel.com',
      hours: contactInfo?.departments?.reservations?.hours || '24/7'
    },
    {
      name: 'Concierge',
      phone: contactInfo?.departments?.concierge?.phone || '+1 (555) 123-4568',
      email: contactInfo?.departments?.concierge?.email || 'concierge@oldvinehotel.com',
      hours: contactInfo?.departments?.concierge?.hours || '6:00 AM - 12:00 AM'
    },
    {
      name: 'Restaurant',
      phone: contactInfo?.departments?.restaurant?.phone || '+1 (555) 123-4569',
      email: contactInfo?.departments?.restaurant?.email || 'restaurant@oldvinehotel.com',
      hours: contactInfo?.departments?.restaurant?.hours || '6:30 AM - 11:00 PM'
    },
    {
      name: 'Spa & Wellness',
      phone: contactInfo?.departments?.spa?.phone || '+1 (555) 123-4570',
      email: contactInfo?.departments?.spa?.email || 'spa@oldvinehotel.com',
      hours: contactInfo?.departments?.spa?.hours || '8:00 AM - 9:00 PM'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - The Old Vine Hotel</title>
        <meta name="description" content="Get in touch with The Old Vine Hotel. Contact us for reservations, inquiries, or any assistance you need during your stay." />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '60vh',
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/gallery/hotel-gallery/31.jpg") center/cover',
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
                fontFamily: 'Playfair Display',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              {t('contact.title')}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              {t('contact.subtitle')}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  component="a"
                  href={card.action}
                  target={card.action.startsWith('http') ? '_blank' : '_self'}
                  rel={card.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
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
                    {card.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    {card.primary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.secondary}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form and Departments */}
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={12}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    mb: 3,
                    color: 'primary.main',
                  }}
                >
                  Send us a Message
                </Typography>
                
                {submitStatus && (
                  <Alert 
                    severity={submitStatus.type} 
                    sx={{ mb: 3 }}
                    onClose={() => setSubmitStatus(null)}
                  >
                    {submitStatus.message}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="name"
                        label={t('contact.name')}
                        fullWidth
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="email"
                        label={t('contact.email')}
                        type="email"
                        fullWidth
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="phone"
                        label={t('contact.phone')}
                        fullWidth
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="subject"
                        label="Subject"
                        fullWidth
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="message"
                        label={t('contact.message')}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<Send />}
                        disabled={submitContactForm.isLoading}
                        sx={{ px: 4, py: 2 }}
                      >
                        {submitContactForm.isLoading ? 'Sending...' : t('contact.sendMessage')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Social Media */}
              <Card sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    mb: 3,
                    color: 'primary.main',
                  }}
                >
                  Follow Us
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton
                    component="a"
                    href={contactInfo?.socialMedia?.facebook || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#1877F2',
                      color: 'white',
                      '&:hover': { backgroundColor: '#166FE5' },
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={contactInfo?.socialMedia?.instagram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#E4405F',
                      color: 'white',
                      '&:hover': { backgroundColor: '#D62D4A' },
                    }}
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={contactInfo?.socialMedia?.twitter || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#1DA1F2',
                      color: 'white',
                      '&:hover': { backgroundColor: '#1A91DA' },
                    }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://wa.me/963986105010"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#25D366',
                      color: 'white',
                      '&:hover': { backgroundColor: '#22C55E' },
                    }}
                  >
                    <WhatsApp />
                  </IconButton>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box sx={{ width: '100%', height: 400, bgcolor: 'grey.200' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.1234567890123!2d36.2765!3d33.5138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9f3c2b8b8b8b8b!2sOld%20Damascus%20City!5e0!3m2!1sen!2ssy!4v1704067200000!5m2!1sen!2ssy&zoom=16"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Location"
        />
      </Box>
    </>
  );
};

export default Contact;