import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

// Context
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Rooms from './pages/Rooms';
import CategoryGallery from './pages/CategoryGallery';
import RoomDetails from './pages/RoomDetails';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import GalleryCategory from './pages/GalleryCategory';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import DashboardMain from './pages/admin/DashboardMain';
import ContentManagement from './pages/admin/ContentManagement';
import RoomManagement from './pages/admin/RoomManagement';
import BookingManagement from './pages/admin/BookingManagement';
import MediaManagement from './pages/admin/MediaManagement';
import BlogManagement from './pages/admin/BlogManagement';
import SettingsManagement from './pages/admin/SettingsManagement';

// Loading Component
const Loading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    bgcolor="background.default"
  >
    <CircularProgress size={50} thickness={4} />
  </Box>
);

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <ScrollToTop />
    <Header />
    {children}
    <Footer />
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/rooms" element={<PublicLayout><Rooms /></PublicLayout>} />
          <Route path="/rooms/category/:categorySlug" element={<PublicLayout><CategoryGallery /></PublicLayout>} />
          <Route path="/rooms/:id" element={<PublicLayout><RoomDetails /></PublicLayout>} />
          <Route path="/facilities" element={<PublicLayout><Facilities /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/gallery/:categorySlug" element={<PublicLayout><GalleryCategory /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
          <Route path="/booking/confirmation" element={<PublicLayout><BookingConfirmation /></PublicLayout>} />

          {/* Admin Login (Public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardMain />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="media" element={<MediaManagement />} />
            <Route path="settings" element={<SettingsManagement />} />
            <Route path="*" element={<DashboardMain />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;