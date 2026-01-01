import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import AppShell from './components/layout/AppShell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MediaGallery from './pages/MediaGallery';
import ImageUpload from './pages/ImageUpload';
import ImageDetail from './pages/ImageDetail';
import ZipDownload from './pages/ZipDownload';
import UserProfile from './pages/UserProfile';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminDashboard from './pages/AdminDashboard';
import AdminMedia from './pages/AdminMedia';
import ContactForm from './pages/ContactForm';
import AdminContactMessages from './pages/AdminContactMessages';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import OAuthCallback from './pages/OAuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="gallery" element={<MediaGallery />} />
              <Route path="upload" element={<ImageUpload />} />
              <Route path="image/:id" element={<ImageDetail />} />
              <Route path="zip-download" element={<ZipDownload />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="contact" element={<ContactForm />} />
              <Route
                path="admin"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="admin/users"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminUserManagement />
                  </RoleGuard>
                }
              />
              <Route
                path="admin/media"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminMedia />
                  </RoleGuard>
                }
              />
              <Route
                path="admin/contacts"
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminContactMessages />
                  </RoleGuard>
                }
              />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

