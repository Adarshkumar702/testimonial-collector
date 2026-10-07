import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicLayout } from '../layouts/PublicLayout';

// Auth Pages
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { VerifyEmail } from '../pages/VerifyEmail';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';

// Dashboard Pages
import { Dashboard } from '../pages/Dashboard';
import { Spaces } from '../pages/Spaces';
import { CreateSpace } from '../pages/CreateSpace';
import { Reviews } from '../pages/Reviews';
import { Analytics } from '../pages/Analytics';
import { EmbedGenerator } from '../pages/EmbedGenerator';

// Public Pages
import { Landing } from '../pages/Landing';
import { CollectionPage } from '../pages/CollectionPage';
import { WallOfLove } from '../pages/WallOfLove';
import { EmbedPage } from '../pages/EmbedPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Standalone Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Standalone Public Customer Routes */}
      <Route path="/collect/:spaceSlug" element={<CollectionPage />} />
      <Route path="/wall/:spaceSlug" element={<WallOfLove />} />
      <Route path="/embed/:spaceSlug" element={<EmbedPage />} />

      {/* Public Pages with Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Protected Owner Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="spaces" element={<Spaces />} />
        <Route path="spaces/new" element={<CreateSpace />} />
        <Route path="spaces/edit/:id" element={<CreateSpace />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="embed" element={<EmbedGenerator />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
