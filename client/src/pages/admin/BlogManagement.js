import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../../utils/api';

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'News', 'Events', 'Travel Tips', 'Local Attractions',
    'Hotel Updates', 'Food & Dining', 'Spa & Wellness',
    'Special Offers', 'Guest Stories', 'Behind the Scenes'
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/blog/admin/all');
      setPosts(response.data.data?.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setMessage({ type: 'error', text: 'Failed to load blog posts' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentPost({
      title: '',
      excerpt: '',
      content: '',
      category: 'News',
      status: 'draft',
      tags: []
    });
    setDialogOpen(true);
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (currentPost._id) {
        await api.put(`/api/blog/${currentPost._id}`, currentPost);
        setMessage({ type: 'success', text: 'Post updated successfully!' });
      } else {
        await api.post('/api/blog', currentPost);
        setMessage({ type: 'success', text: 'Post created successfully!' });
      }
      setDialogOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({ type: 'error', text: 'Failed to save post' });
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/api/blog/${postId}`);
        setMessage({ type: 'success', text: 'Post deleted successfully!' });
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        setMessage({ type: 'error', text: 'Failed to delete post' });
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = { draft: 'default', published: 'success', archived: 'warning' };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Blog Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage blog posts
          </Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          New Post
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No blog posts found</TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <Chip label={post.status} color={getStatusColor(post.status)} size="small" />
                  </TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(post)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(post._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentPost?._id ? 'Edit Post' : 'New Post'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={currentPost?.title || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={currentPost?.category || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={currentPost?.status || 'draft'}
                onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value })}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Excerpt"
                value={currentPost?.excerpt || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Content"
                value={currentPost?.content || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagement;

