import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) {
      return;
    }

    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    hasHandled.current = true;

    if (error) {
      showToast(error, 'error');
      navigate('/login', { replace: true });
      return;
    }

    if (token && userParam) {
      try {
        const decoded = decodeURIComponent(userParam);
        const user = JSON.parse(decoded);
        
        try {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          login(token, user);
          showToast('Google login successful', 'success');
          navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
        } catch (storageErr) {
          console.error('Failed to store auth data:', storageErr);
          showToast('Failed to complete login', 'error');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        showToast('Failed to complete login', 'error');
        navigate('/login', { replace: true });
      }
    } else {
      showToast('Invalid callback parameters', 'error');
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-lg text-gray-600">Completing login...</div>
    </div>
  );
};

export default OAuthCallback;

