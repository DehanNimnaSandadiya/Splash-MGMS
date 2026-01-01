import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import api from '../utils/axios';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      showToast('OTP sent to your email', 'success');
    } catch (error) {
      showToast(
        error.response?.data?.error || 'Failed to send OTP',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      showToast('Password reset successful', 'success');
      navigate('/login');
    } catch (error) {
      showToast(
        error.response?.data?.error || 'Password reset failed',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-luxury-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:gradient-mesh opacity-30 dark:opacity-30" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(29,36,116,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(0,229,255,0.1),transparent_50%)]" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2.5 rounded-xl text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 z-50"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glass" className="w-full">
          <div className="flex justify-center mb-6 space-x-2">
            <Badge variant={step >= 1 ? 'primary' : 'default'}>
              1. Request OTP
            </Badge>
            <Badge variant={step >= 2 ? 'primary' : 'default'}>2. Reset</Badge>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="text-slate-600 dark:text-gray-400">
              Step {step} of 2
            </p>
          </div>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="request"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRequestOtp}
                className="space-y-5"
              >
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <div className="text-center mb-4 p-4 glass rounded-2xl border-luxury-indigo/30 dark:border-luxury-glow/30">
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    OTP sent to
                  </p>
                  <p className="font-medium text-luxury-indigo dark:text-luxury-glow mt-1">
                    {email}
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
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-luxury-indigo dark:text-luxury-glow hover:text-luxury-teal dark:hover:text-luxury-cyan transition-colors"
            >
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

