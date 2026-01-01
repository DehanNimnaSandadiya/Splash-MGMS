import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-luxury-dark px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <h1 className="text-8xl font-bold text-luxury-indigo dark:text-luxury-glow mb-4">
            404
          </h1>
        </motion.div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-600 dark:text-gray-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

