import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import api from '../../utils/api';

const SettingsManagement = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings');
      setSettings(response.data.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      await api.put('/api/settings', settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (path, value) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const toggleColorPicker = (field) => {
    setShowColorPicker(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Settings not found. Please create default settings.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure global website settings, contact information, and branding
        </Typography>
      </Box>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Site Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Site Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Site Name"
              value={settings.siteName || ''}
              onChange={(e) => handleChange('siteName', e.target.value)}
              helperText="Your hotel name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Site Description"
              value={settings.siteDescription || ''}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              helperText="Brief description of your hotel"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Site Keywords"
              value={settings.siteKeywords || ''}
              onChange={(e) => handleChange('siteKeywords', e.target.value)}
              helperText="Comma-separated keywords for SEO"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              helperText="Primary contact email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={settings.contactPhone || ''}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              helperText="Primary phone number"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="WhatsApp Number"
              value={settings.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              helperText="WhatsApp contact number"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              value={settings.address?.street || ''}
              onChange={(e) => handleChange('address.street', e.target.value)}
              helperText="Hotel address"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              value={settings.address?.city || ''}
              onChange={(e) => handleChange('address.city', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              value={settings.address?.country || ''}
              onChange={(e) => handleChange('address.country', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Social Media */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Social Media Links
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Facebook URL"
              value={settings.socialMedia?.facebook || ''}
              onChange={(e) => handleChange('socialMedia.facebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Instagram URL"
              value={settings.socialMedia?.instagram || ''}
              onChange={(e) => handleChange('socialMedia.instagram', e.target.value)}
              placeholder="https://instagram.com/yourpage"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Twitter URL"
              value={settings.socialMedia?.twitter || ''}
              onChange={(e) => handleChange('socialMedia.twitter', e.target.value)}
              placeholder="https://twitter.com/yourpage"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Theme Colors */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Theme Colors
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {['primaryColor', 'secondaryColor', 'accentColor'].map((colorField) => (
            <Grid item xs={12} md={4} key={colorField}>
              <TextField
                fullWidth
                label={colorField.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                value={settings.theme?.[colorField] || '#000000'}
                onClick={() => toggleColorPicker(colorField)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundColor: settings.theme?.[colorField] || '#000000',
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleColorPicker(colorField)}
                      />
                    </InputAdornment>
                  ),
                }}
                helperText="Click to open color picker"
                sx={{ cursor: 'pointer' }}
              />
              {showColorPicker[colorField] && (
                <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                  <Box
                    sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                    onClick={() => toggleColorPicker(colorField)}
                  />
                  <ChromePicker
                    color={settings.theme?.[colorField] || '#000000'}
                    onChange={(color) => handleChange(`theme.${colorField}`, color.hex)}
                  />
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
        
        <Alert severity="info" sx={{ mt: 3 }}>
          Note: Theme color changes require a page refresh to take effect on the public website.
        </Alert>
      </Paper>

      {/* SEO Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          SEO Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Default Meta Title"
              value={settings.seo?.metaTitle || ''}
              onChange={(e) => handleChange('seo.metaTitle', e.target.value)}
              helperText="Default title for SEO (used when page doesn't have specific title)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Default Meta Description"
              value={settings.seo?.metaDescription || ''}
              onChange={(e) => handleChange('seo.metaDescription', e.target.value)}
              helperText="Default description for SEO (150-160 characters recommended)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="OG Image URL"
              value={settings.seo?.ogImage || ''}
              onChange={(e) => handleChange('seo.ogImage', e.target.value)}
              helperText="Default image for social media sharing"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Booking Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Booking Configuration
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Minimum Nights"
              value={settings.bookingSettings?.minNights || 1}
              onChange={(e) => handleChange('bookingSettings.minNights', parseInt(e.target.value))}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Maximum Nights"
              value={settings.bookingSettings?.maxNights || 30}
              onChange={(e) => handleChange('bookingSettings.maxNights', parseInt(e.target.value))}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="time"
              label="Check-in Time"
              value={settings.bookingSettings?.checkInTime || '14:00'}
              onChange={(e) => handleChange('bookingSettings.checkInTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="time"
              label="Check-out Time"
              value={settings.bookingSettings?.checkOutTime || '12:00'}
              onChange={(e) => handleChange('bookingSettings.checkOutTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Cancellation Policy"
              value={settings.bookingSettings?.cancellationPolicy || ''}
              onChange={(e) => handleChange('bookingSettings.cancellationPolicy', e.target.value)}
              helperText="Describe your cancellation policy"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={fetchSettings}
          disabled={saving}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          size="large"
        >
          {saving ? <CircularProgress size={24} /> : 'Save All Changes'}
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsManagement;
