import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Services from '../pages/Services';
import NearbyServices from '../pages/NearbyServices';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProviderDetails from '../pages/ProviderDetails';
import BookingPage from '../pages/BookingPage';
import UserDashboard from '../pages/UserDashboard';
import Profile from '../pages/Profile';
import ProviderDashboard from '../pages/ProviderDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminServices from '../pages/AdminServices';
import AdminProviders from '../pages/AdminProviders';
import AdminBookings from '../pages/AdminBookings';
import AdminUsers from '../pages/AdminUsers';
import AdminAnalytics from '../pages/AdminAnalytics';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="nearby" element={<NearbyServices />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="provider/:id" element={<ProviderDetails />} />
        <Route path="booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="dashboard/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="dashboard/provider" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
        <Route path="dashboard/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="dashboard/admin/services" element={<ProtectedRoute adminOnly><AdminServices /></ProtectedRoute>} />
        <Route path="dashboard/admin/providers" element={<ProtectedRoute adminOnly><AdminProviders /></ProtectedRoute>} />
        <Route path="dashboard/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
        <Route path="dashboard/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="dashboard/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
