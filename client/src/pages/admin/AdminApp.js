import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

import Login from "./Login";
import DashboardMain from "./DashboardMain";
import ContentManagement from "./ContentManagement";
import RoomManagement from "./RoomManagement";
import BookingManagement from "./BookingManagement";
import MediaManagement from "./MediaManagement";
import BlogManagement from "./BlogManagement";
import SettingsManagement from "./SettingsManagement";

function RequireAdmin({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

function AdminShell() {
  return <Outlet />;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route
        element={
          <RequireAdmin>
            <AdminShell />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardMain />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="media" element={<MediaManagement />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="settings" element={<SettingsManagement />} />
      </Route>
    </Routes>
  );
}
