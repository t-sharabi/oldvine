import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Header = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // ✅ لون غامق ثابت للهيدر الفاتح (حتى لو الثيم Dark)
  const lightHeaderText = '#1a1a1a';

  // ✅ Pending 17: Book Now -> WhatsApp with preset message
  const WA_NUMBER = '963986105010';
  const WA_TEXT = encodeURIComponent(
    'For all booking inquiries and reservation confirmations, kindly contact us via WhatsApp'
  );
  const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`;

  const navigationItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.rooms'), path: '/rooms' },
    { label: t('nav.facilities'), path: '/facilities' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ صفحات الخلفية عندها فاتحة (زيدي هون أي route تاني)
  const lightHeaderRoutes = ['/facilities', '/contact'];
  const forceLightHeader = lightHeaderRoutes.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + '/')
  );

  const isLightHeader = scrolled || forceLightHeader;

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLanguageClick = (event) => setLanguageAnchor(event.currentTarget);
  const handleLanguageClose = () => setLanguageAnchor(null);
  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    handleLanguageClose();
  };

  const isActiveRoute = (path) => location.pathname === path;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <img
          src="/images/logo.png"
          alt="Old Vine Hotel"
          style={{ height: '45px', width: 'auto' }}
        />
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                textAlign: 'center',
                backgroundColor: isActiveRoute(item.path) ? 'primary.main' : 'transparent',
                color: isActiveRoute(item.path) ? 'white' : lightHeaderText,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* ✅ Pending 17: Drawer Book Now -> WhatsApp */}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textAlign: 'center',
              backgroundColor: 'secondary.main',
              color: 'secondary.contrastText',
              m: 2,
              borderRadius: 2,
              '&:hover': { backgroundColor: 'secondary.dark' },
            }}
          >
            <ListItemText primary={t('nav.booking')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: isLightHeader ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          color: isLightHeader ? lightHeaderText : 'white',
          transition: 'all 0.3s ease-in-out',
          backdropFilter: isLightHeader ? 'blur(10px)' : 'none',
          boxShadow: isLightHeader ? 3 : 0,
          zIndex: 1300,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <img
                src="/images/logo.png"
                alt="Old Vine Hotel"
                style={{
                  height: isLightHeader ? '50px' : '60px',
                  width: 'auto',
                  transition: 'all 0.3s ease-in-out',
                }}
              />
            </Box>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Button
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isLightHeader
                        ? (isActiveRoute(item.path) ? 'secondary.main' : lightHeaderText)
                        : 'white',
                      fontWeight: isActiveRoute(item.path) ? 600 : 400,
                      borderBottom: isActiveRoute(item.path) ? 2 : 0,
                      borderColor: 'secondary.main',
                      borderRadius: 0,
                      opacity: isActiveRoute(item.path) ? 1 : 0.85,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: isLightHeader ? 'secondary.main' : 'white',
                        opacity: 1,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}

              {/* Language Selector */}
              <IconButton onClick={handleLanguageClick} sx={{ color: 'inherit' }}>
                <LanguageIcon />
              </IconButton>

              {/* ✅ Pending 17: Book Now -> WhatsApp */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  component="a"
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="secondary"
                  sx={{ fontWeight: 600, px: 3 }}
                >
                  {t('nav.booking')}
                </Button>
              </motion.div>
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleLanguageClick} sx={{ color: 'inherit' }}>
                <LanguageIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Header;
