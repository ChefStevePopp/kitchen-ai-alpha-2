import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, AuthLayout } from '@/shared/layouts';
import { SignIn } from '@/features/auth/components/SignIn';
import { SignUp } from '@/features/auth/components/SignUp';
import { PrivateRoute } from '@/components/PrivateRoute';
import { ROUTES } from '@/config/routes';
import { AdminRoutes } from '@/features/admin/routes';
import { KitchenRoutes } from '@/features/kitchen/routes';
import { LoadingLogo } from '@/features/shared/components';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <LoadingLogo message="Loading KITCHEN AI..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      {/* Protected Kitchen Routes */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/kitchen/*" element={<KitchenRoutes />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={<PrivateRoute><AdminRoutes /></PrivateRoute>} />

      {/* Default Routes */}
      <Route path="/" element={
        user ? <Navigate to="/kitchen" replace /> : <Navigate to="/auth/signin" replace />
      } />
      <Route path="*" element={
        <Navigate to={user ? "/kitchen" : "/auth/signin"} replace />
      } />
    </Routes>
  );
}

export default App;