import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-luxury-dark px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 inline-block"
        >
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <ShieldX className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </motion.div>
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
          403
        </h1>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
          Unauthorized Access
        </h2>
        <p className="text-slate-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page. Please contact an
          administrator if you believe this is an error.
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

export default Unauthorized;

