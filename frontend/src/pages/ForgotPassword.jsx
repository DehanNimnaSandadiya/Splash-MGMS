import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import { useToast } from '../components/ui/Toast';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-luxury-dark py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="w-full border-0 shadow-xl">
          <div className="flex justify-center mb-6 space-x-2">
            <Badge variant={step >= 1 ? 'primary' : 'default'}>
              1. Request OTP
            </Badge>
            <Badge variant={step >= 2 ? 'primary' : 'default'}>2. Reset</Badge>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
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
                <div className="text-center mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    OTP sent to
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">
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
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
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

export default ForgotPassword;

