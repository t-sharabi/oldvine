import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import axios from 'axios';

const HOTEL_WHATSAPP = '963986105010';

const Contact = () => {
  const { t, i18n } = useTranslation();

  const lang = (i18n.resolvedLanguage || i18n.language || 'en').toLowerCase();
  const isAr = lang.startsWith('ar');
  const isFr = lang.startsWith('fr');

  const tf = (key, en, ar, fr) => t(key, isAr ? ar : isFr ? fr : en);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const { data: contactInfo } = useQuery(
    'contactInfo',
    () => axios.get('/api/contact/info').then((res) => res.data.data),
    {
      staleTime: 5 * 60 * 1000,
      retry: 0,
    }
  );

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openWhatsApp = () => {
    const lines = [
      tf(
        'contact.whatsappNewMessageHeader',
        'New message from website:',
        'رسالة جديدة من موقع الفندق:',
        'Nouveau message du site web :'
      ),
      `${tf('contact.whatsappLabelName', 'Name', 'الاسم', 'Nom')}: ${formData.name}`,
      `${tf('contact.whatsappLabelEmail', 'Email', 'البريد الإلكتروني', 'E-mail')}: ${formData.email}`,
      `${tf('contact.whatsappLabelPhone', 'Phone', 'الهاتف', 'Téléphone')}: ${formData.phone || '-'}`,
      `${tf('contact.whatsappLabelSubject', 'Subject', 'الموضوع', 'Sujet')}: ${formData.subject || '-'}`,
      `${tf('contact.whatsappLabelMessage', 'Message', 'الرسالة', 'Message')}: ${formData.message}`,
    ];

    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${HOTEL_WHATSAPP}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: tf(
          'contact.requiredFields',
          'Please fill the required fields (name, email, message).',
          'يرجى تعبئة الحقول المطلوبة (الاسم، البريد الإلكتروني، الرسالة).',
          'Veuillez remplir les champs obligatoires (nom, e-mail, message).'
        ),
      });
      return;
    }

    openWhatsApp();

    setSubmitStatus({
      type: 'success',
      message: tf(
        'contact.whatsappOpened',
        'WhatsApp opened. Press Send inside WhatsApp to deliver your message.',
        'تم فتح واتساب. اضغط "إرسال" داخل واتساب لإرسال رسالتك.',
        'WhatsApp s’est ouvert. Appuyez sur Envoyer داخل WhatsApp pour إرسال رسالتك.'
      ),
    });

    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactCards = [
    {
      title: tf('contact.cardPhoneTitle', 'Phone', 'الهاتف', 'Téléphone'),
      icon: <Phone sx={{ fontSize: 40 }} />,
      primary: '0112241609',
      secondary: tf('contact.cardPhoneSecondary', '24/7 Available', 'متاح 24/7', 'Disponible 24/7'),
      action: 'tel:0112241609',
    },
    {
      title: tf('contact.cardEmailTitle', 'Email', 'البريد الإلكتروني', 'E-mail'),
      icon: <Email sx={{ fontSize: 40 }} />,
      primary: 'reservations@oldvinehotel.com',
      secondary: tf(
        'contact.cardEmailSecondary',
        'Response within 24 hours',
        'الرد خلال 24 ساعة',
        'Réponse sous 24 heures'
      ),
      action: 'mailto:reservations@oldvinehotel.com',
    },
    {
      title: tf('contact.cardWhatsAppTitle', 'WhatsApp', 'واتساب', 'WhatsApp'),
      icon: <WhatsApp sx={{ fontSize: 40 }} />,
      primary: '+963986105010',
      secondary: tf('contact.cardWhatsAppSecondary', 'Quick responses', 'رد سريع', 'Réponses rapides'),
      action: `https://wa.me/${HOTEL_WHATSAPP}`,
    },
    {
      title: tf('contact.cardAddressTitle', 'Address', 'العنوان', 'Adresse'),
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      primary: contactInfo?.hotel?.address?.formatted || tf('contact.addressFallback', 'Old Vine Hotel, Damascus', 'فندق أولد فاين - دمشق', 'Old Vine Hotel, Damas'),
      secondary: t('contact.directions'),
      action: 'https://www.google.com/maps/search/?api=1&query=Old%20Vine%20Hotel%20Damascus',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{tf('contact.pageTitle', 'Contact Us - The Old Vine Hotel', 'تواصل معنا - فندق أولد فاين', 'Contact - The Old Vine Hotel')}</title>
        <meta
          name="description"
          content={tf(
            'contact.pageDescription',
            'Get in touch with The Old Vine Hotel. Contact us for reservations, inquiries, or any assistance you need during your stay.',
            'تواصل مع فندق أولد فاين للحجوزات والاستفسارات وأي مساعدة تحتاجها أثناء إقامتك.',
            'Contactez The Old Vine Hotel pour les réservations, questions, ou toute assistance pendant votre séjour.'
          )}
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '60vh',
          background:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/gallery/hotel-gallery/31.jpg") center/cover',
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
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, color: 'primary.main' }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
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

        {/* Contact Form */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={12}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
                  {tf('contact.sendUsMessageTitle', 'Send us a Message', 'أرسل لنا رسالة', 'Envoyez-nous un message')}
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
                        label={tf('contact.subject', 'Subject', 'الموضوع', 'Sujet')}
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
                        sx={{ px: 4, py: 2 }}
                      >
                        {t('contact.sendMessage')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                  {tf('contact.followUs', 'Follow Us', 'تابعنا', 'Suivez-nous')}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton
                    component="a"
                    href={contactInfo?.socialMedia?.facebook || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ backgroundColor: '#1877F2', color: 'white' }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={contactInfo?.socialMedia?.instagram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ backgroundColor: '#E4405F', color: 'white' }}
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={contactInfo?.socialMedia?.twitter || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ backgroundColor: '#1DA1F2', color: 'white' }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={`https://wa.me/${HOTEL_WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ backgroundColor: '#25D366', color: 'white' }}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d881.089256494776!2d36.30748342144017!3d33.51308026272531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e728348b96bf%3A0x9a06409382325607!2sOld%20Vine%20Hotel!5e0!3m2!1$ar!2s!4v1766475597734!5m2!1$ar!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={tf('contact.mapTitle', 'Hotel Location', 'موقع الفندق', 'Emplacement de l’hôtel')}
        />
      </Box>
    </>
  );
};

export default Contact;
