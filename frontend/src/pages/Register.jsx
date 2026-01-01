import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setUserId(response.data.data.userId);
      setStep(2);
      showToast('OTP sent to your email', 'success');
    } catch (error) {
      showToast(
        error.response?.data?.error || 'Registration failed',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        email: formData.email,
        otp,
      });
      login(response.data.data.token, response.data.data.user);
      showToast('Registration successful', 'success');
      navigate('/');
    } catch (error) {
      showToast(
        error.response?.data?.error || 'OTP verification failed',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      showToast('OTP resent to your email', 'success');
    } catch (error) {
      showToast('Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-luxury-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:gradient-mesh opacity-30 dark:opacity-30" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(29,36,116,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(0,229,255,0.1),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glass" className="w-full">
          <div className="flex justify-center mb-6 space-x-2">
            <Badge variant={step >= 1 ? 'primary' : 'default'}>
              1. Register
            </Badge>
            <Badge variant={step >= 2 ? 'primary' : 'default'}>
              2. Verify OTP
            </Badge>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">
              Step {step} of 2
            </p>
          </div>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-5"
              >
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <div className="text-center mb-4 p-4 glass rounded-2xl border-luxury-glow/30">
                  <p className="text-sm text-gray-400">
                    We've sent a 6-digit OTP to
                  </p>
                  <p className="font-medium text-luxury-glow mt-1">
                    {formData.email}
                  </p>
                </div>
                <Input
                  label="OTP"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
