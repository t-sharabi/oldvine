import React, { useMemo } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Navigation, Thumbs } from 'swiper/modules';

const ROOM_CONFIG = {
  '1': {
    name: 'Deluxe Room',
    folder: '/images/rooms/deluxe',
    features: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar'],
    price: 199,
    images: [
      '01.jpg',
      '02.jpg',
      '03.jpg',
      '04.jpg',
      '05.jpg'
    ],
  },
  '2': {
    name: 'Executive Suite',
    folder: '/images/rooms/executive',
    features: ['Separate Living Room', 'Premium View', 'Butler Service', 'Complimentary Breakfast'],
    price: 349,
    images: [
      '01.jpg',
      '02.jpg',
      '03.jpg',
      '04.jpg',
      '05.jpg'
    ],
  },
  '3': {
    name: 'Presidential Suite',
    folder: '/images/rooms/presidential',
    features: ['2 Bedrooms', 'Private Terrace', 'Personal Chef', 'Spa Access'],
    price: 599,
    images: [
      '01.jpg',
      '02.jpg',
      '03.jpg',
      '04.jpg',
      '05.jpg'
    ],
  },
};

SwiperCore.use([Navigation, Thumbs]);

const RoomDetails = () => {
  const { id } = useParams();
  const room = ROOM_CONFIG[id] || ROOM_CONFIG['1'];

  const imageUrls = useMemo(() => {
    return (room.images || []).map(name => `${room.folder}/${name}`);
  }, [room]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {room.name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          From ${room.price} <Typography component="span" variant="body2" color="text.secondary">per night</Typography>
        </Typography>
        <Box sx={{ mt: 2 }}>
          {room.features.map((f, i) => (
            <Chip key={i} label={f} size="small" sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>
      </Box>

      {/* Gallery */}
      {imageUrls.length > 0 ? (
        <>
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            style={{ borderRadius: 8, overflow: 'hidden' }}
         >
            {imageUrls.map((src, idx) => (
              <SwiperSlide key={idx}>
                <Box
                  component="img"
                  src={src}
                  alt={`${room.name} ${idx + 1}`}
                  loading="lazy"
                  sx={{ width: '100%', height: { xs: 260, sm: 420, md: 520 }, objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {imageUrls.map((src, idx) => (
              <Grid item xs={3} sm={2} md={2} key={`thumb-${idx}`}> 
                <Box
                  component="img"
                  src={src}
                  alt={`${room.name} thumb ${idx + 1}`}
                  loading="lazy"
                  sx={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              No images have been added yet. Place files in {room.folder} and refresh.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default RoomDetails;