import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../utils/api';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ],
};

const ContentManagement = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchContent(selectedPage);
  }, [selectedPage]);

  const fetchContent = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/content/${page}`);
      setContent(response.data.data.content);
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage({ type: 'error', text: `Failed to load ${page} content` });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      await api.put(`/api/content/${selectedPage}`, content);
      setMessage({ type: 'success', text: 'Content saved successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save content' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleSectionChange = (sectionId, field, value) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.sectionId === sectionId
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  const handleSectionItemChange = (sectionId, itemIndex, field, value) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.sectionId === sectionId
          ? {
              ...section,
              items: section.items.map((item, idx) =>
                idx === itemIndex ? { ...item, [field]: value } : item
              )
            }
          : section
      )
    }));
  };

  const addSectionItem = (sectionId) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.sectionId === sectionId
          ? {
              ...section,
              items: [...(section.items || []), { title: '', description: '' }]
            }
          : section
      )
    }));
  };

  const removeSectionItem = (sectionId, itemIndex) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.sectionId === sectionId
          ? {
              ...section,
              items: section.items.filter((_, idx) => idx !== itemIndex)
            }
          : section
      )
    }));
  };

  const handleSEOChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const handleKeywordsChange = (value) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    handleSEOChange('keywords', keywords);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!content) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Content not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Edit homepage and about page content
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

      {/* Page Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedPage} 
          onChange={(e, value) => setSelectedPage(value)}
          variant="fullWidth"
        >
          <Tab label="Homepage" value="home" />
          <Tab label="About Page" value="about" />
        </Tabs>
      </Paper>

      {/* Hero Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Hero Section
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hero Title"
              value={content.hero?.title || ''}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              helperText="Main headline on the page"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hero Subtitle"
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              helperText="Secondary headline"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Hero Description"
              value={content.hero?.description || ''}
              onChange={(e) => handleHeroChange('description', e.target.value)}
              helperText="Brief description below the title"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Background Image URL"
              value={content.hero?.backgroundImage || ''}
              onChange={(e) => handleHeroChange('backgroundImage', e.target.value)}
              helperText="Path to hero background image"
            />
          </Grid>
          {selectedPage === 'home' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CTA Button Text"
                  value={content.hero?.ctaText || ''}
                  onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                  helperText="Call-to-action button label"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CTA Button Link"
                  value={content.hero?.ctaLink || ''}
                  onChange={(e) => handleHeroChange('ctaLink', e.target.value)}
                  helperText="Where the button links to"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Content Sections */}
      {content.sections?.map((section, idx) => (
        <Paper key={section.sectionId || idx} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {section.title || `Section: ${section.sectionId}`}
            <Chip 
              label={section.isActive ? 'Active' : 'Inactive'} 
              color={section.isActive ? 'success' : 'default'}
              size="small" 
              sx={{ ml: 2 }}
            />
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Section Title"
                value={section.title || ''}
                onChange={(e) => handleSectionChange(section.sectionId, 'title', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Section Subtitle"
                value={section.subtitle || ''}
                onChange={(e) => handleSectionChange(section.sectionId, 'subtitle', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Section Content
              </Typography>
              <ReactQuill
                theme="snow"
                value={section.content || ''}
                onChange={(value) => handleSectionChange(section.sectionId, 'content', value)}
                modules={quillModules}
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </Grid>

            {section.image && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Section Image URL"
                  value={section.image || ''}
                  onChange={(e) => handleSectionChange(section.sectionId, 'image', e.target.value)}
                />
              </Grid>
            )}

            {/* Section Items (for lists) */}
            {section.items && section.items.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    Items ({section.items.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addSectionItem(section.sectionId)}
                  >
                    Add Item
                  </Button>
                </Box>
                
                {section.items.map((item, itemIdx) => (
                  <Card key={itemIdx} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2">Item {itemIdx + 1}</Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeSectionItem(section.sectionId, itemIdx)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Title"
                            value={item.title || ''}
                            onChange={(e) => handleSectionItemChange(section.sectionId, itemIdx, 'title', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Description"
                            value={item.description || ''}
                            onChange={(e) => handleSectionItemChange(section.sectionId, itemIdx, 'description', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}

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
              label="Meta Title"
              value={content.seo?.title || ''}
              onChange={(e) => handleSEOChange('title', e.target.value)}
              helperText="Title for search engines and browser tabs"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Meta Description"
              value={content.seo?.description || ''}
              onChange={(e) => handleSEOChange('description', e.target.value)}
              helperText="Description for search engines (150-160 characters recommended)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Keywords"
              value={content.seo?.keywords?.join(', ') || ''}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              helperText="Comma-separated keywords"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="OG Image URL"
              value={content.seo?.ogImage || ''}
              onChange={(e) => handleSEOChange('ogImage', e.target.value)}
              helperText="Image for social media sharing"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => fetchContent(selectedPage)}
          disabled={saving}
        >
          Reset Changes
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          size="large"
        >
          {saving ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Changes will be visible on the public website immediately after saving.
          Use the rich text editor to format content with headings, lists, and links.
        </Typography>
      </Alert>
    </Container>
  );
};

export default ContentManagement;
