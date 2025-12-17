import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  FormHelperText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import api from '../../utils/api';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const AMENITIES_OPTIONS = [
  'WiFi', 'TV', 'AC', 'Minibar', 'Safe', 'Balcony', 'Ocean View',
  'City View', 'Mountain View', 'Garden View', 'Jacuzzi', 'Fireplace',
  'Kitchen', 'Kitchenette', 'Workspace', 'Butler Service', 'Spa Access',
  'Private Pool', 'Terrace', 'Walk-in Closet', 'Sound System'
];

const BED_TYPES = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Sofa Bed'];
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Executive Suite', 'Presidential Suite'];

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, roomId: null });
  const [currentRoom, setCurrentRoom] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/rooms?limit=100');
      setRooms(response.data.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setMessage({ type: 'error', text: 'Failed to load rooms' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (room = null) => {
    if (room) {
      // Edit mode
      setCurrentRoom({
        ...room,
        images: room.images || [],
        amenities: room.amenities || [],
      });
    } else {
      // Add mode
      setCurrentRoom({
        name: '',
        type: 'Deluxe',
        roomNumber: '',
        floor: 1,
        size: 0,
        maxOccupancy: 2,
        bedType: 'King',
        bedCount: 1,
        basePrice: 0,
        description: '',
        shortDescription: '',
        amenities: [],
        images: [],
        status: 'Available',
        isActive: true,
        smokingAllowed: false,
        petsAllowed: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentRoom(null);
  };

  const handleChange = (field, value) => {
    setCurrentRoom(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setCurrentRoom(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImages = [...currentRoom.images];
    if (newImages[index]) {
      newImages[index].url = value;
    } else {
      newImages[index] = { url: value, alt: '', isPrimary: index === 0 };
    }
    handleChange('images', newImages);
  };

  const addImageField = () => {
    handleChange('images', [...currentRoom.images, { url: '', alt: '', isPrimary: false }]);
  };

  const removeImage = (index) => {
    const newImages = currentRoom.images.filter((_, idx) => idx !== index);
    handleChange('images', newImages);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (currentRoom._id) {
        // Update existing room
        await api.put(`/api/rooms/${currentRoom._id}`, currentRoom);
        setMessage({ type: 'success', text: 'Room updated successfully!' });
      } else {
        // Create new room
        await api.post('/api/rooms', currentRoom);
        setMessage({ type: 'success', text: 'Room created successfully!' });
      }
      
      handleCloseDialog();
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save room' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (roomId) => {
    setConfirmDialog({ open: true, roomId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/rooms/${confirmDialog.roomId}`);
      setMessage({ type: 'success', text: 'Room deleted successfully!' });
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete room' 
      });
    } finally {
      setConfirmDialog({ open: false, roomId: null });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Room Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage hotel rooms, pricing, and availability
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Add New Room
        </Button>
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

      {/* Rooms Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Room Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Room #</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No rooms found. Click "Add New Room" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room._id} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={room.images?.[0]?.url || '/images/room-default.jpg'}
                      alt={room.name}
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {room.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {room.maxOccupancy} guests • {room.size}m²
                    </Typography>
                  </TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ${room.basePrice}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      per night
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={room.isActive ? 'Active' : 'Inactive'}
                      color={room.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(room)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(room._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Room Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {currentRoom?._id ? 'Edit Room' : 'Add New Room'}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {currentRoom && (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Room Name"
                  value={currentRoom.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    value={currentRoom.type}
                    label="Room Type"
                    onChange={(e) => handleChange('type', e.target.value)}
                  >
                    {ROOM_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Room Number"
                  value={currentRoom.roomNumber}
                  onChange={(e) => handleChange('roomNumber', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Floor"
                  value={currentRoom.floor}
                  onChange={(e) => handleChange('floor', parseInt(e.target.value))}
                  required
                />
              </Grid>
              
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Size (m²)"
                  value={currentRoom.size}
                  onChange={(e) => handleChange('size', parseInt(e.target.value))}
                  required
                />
              </Grid>
              
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Guests"
                  value={currentRoom.maxOccupancy}
                  onChange={(e) => handleChange('maxOccupancy', parseInt(e.target.value))}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={6} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Bed Type</InputLabel>
                  <Select
                    value={currentRoom.bedType}
                    label="Bed Type"
                    onChange={(e) => handleChange('bedType', e.target.value)}
                  >
                    {BED_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Beds"
                  value={currentRoom.bedCount}
                  onChange={(e) => handleChange('bedCount', parseInt(e.target.value))}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>

              {/* Pricing */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Pricing
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Base Price (per night)"
                  value={currentRoom.basePrice}
                  onChange={(e) => handleChange('basePrice', parseFloat(e.target.value))}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Price in USD"
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Description
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  value={currentRoom.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  required
                  helperText="Brief one-line description"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Full Description"
                  value={currentRoom.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  helperText="Detailed description of the room"
                />
              </Grid>

              {/* Amenities */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Amenities
                </Typography>
                <FormGroup row>
                  {AMENITIES_OPTIONS.map(amenity => (
                    <FormControlLabel
                      key={amenity}
                      control={
                        <Checkbox
                          checked={currentRoom.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                      }
                      label={amenity}
                      sx={{ minWidth: '150px' }}
                    />
                  ))}
                </FormGroup>
              </Grid>

              {/* Images */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Room Images
                  </Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addImageField}>
                    Add Image
                  </Button>
                </Box>
                <FormHelperText sx={{ mb: 2 }}>
                  Enter image URLs (first image will be the primary image)
                </FormHelperText>
              </Grid>

              {currentRoom.images.map((image, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                    {image.url && (
                      <CardMedia
                        component="img"
                        sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2 }}
                        image={image.url}
                        alt={`Room image ${index + 1}`}
                      />
                    )}
                    <TextField
                      fullWidth
                      size="small"
                      label={`Image ${index + 1} URL`}
                      value={image.url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="/images/rooms/room/01.jpg"
                    />
                    <IconButton onClick={() => removeImage(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}

              {/* Settings */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Settings
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentRoom.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                      />
                    }
                    label="Room is active (visible on website)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentRoom.smokingAllowed}
                        onChange={(e) => handleChange('smokingAllowed', e.target.checked)}
                      />
                    }
                    label="Smoking allowed"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentRoom.petsAllowed}
                        onChange={(e) => handleChange('petsAllowed', e.target.checked)}
                      />
                    }
                    label="Pets allowed"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : (currentRoom?._id ? 'Update Room' : 'Create Room')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDialog({ open: false, roomId: null })}
        confirmText="Delete"
        confirmColor="error"
      />
    </Container>
  );
};

export default RoomManagement;
