import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-luxury-dark">
        <div className="text-lg text-slate-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default ProtectedRoute;

