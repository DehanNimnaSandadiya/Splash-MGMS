import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Share2, User, Upload } from 'lucide-react';
import api from '../utils/axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalImages: 0,
    sharedImages: 0,
    recentImages: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      const response = await api.get('/media');
      const allImages = response.data.data || [];

      const myImages = allImages.filter((img) => {
        const ownerId = img.ownerId?._id?.toString() || img.ownerId?.toString() || img.ownerId;
        const userId = user.id || user._id?.toString();
        return String(ownerId) === String(userId);
      });

      const sortedImages = [...myImages].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setStats({
        totalImages: myImages.length,
        sharedImages: myImages.filter((img) => img.isShared).length,
        recentImages: sortedImages.slice(0, 5),
      });
    } catch (error) {
      showToast('Failed to fetch stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-gray-400 text-lg">
          Welcome back, {user?.name || user?.email || 'User'}!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" className="hover:border-luxury-glow/50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-glow/20 to-luxury-cyan/20 mb-4">
                <Image className="w-7 h-7 text-luxury-glow" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                My Total Images
              </p>
              {loading ? (
                <Skeleton className="h-12 w-24 mx-auto" />
              ) : (
                <p className="text-4xl font-display font-bold text-luxury-indigo dark:text-luxury-glow dark:text-glow mt-2">
                  {stats.totalImages}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" className="hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-teal/20 to-luxury-cyan/20 mb-4">
                <Share2 className="w-7 h-7 text-luxury-teal dark:text-luxury-cyan" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                My Shared Images
              </p>
              {loading ? (
                <Skeleton className="h-12 w-24 mx-auto" />
              ) : (
                <p className="text-4xl font-display font-bold text-luxury-teal dark:text-luxury-cyan mt-2">
                  {stats.sharedImages}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-indigo/20 to-luxury-teal/20 mb-4">
                <User className="w-7 h-7 text-luxury-indigo" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                Role
              </p>
              <Badge variant="primary" className="mt-2">
                {user?.role || 'user'}
              </Badge>
            </div>
          </Card>
        </motion.div>
      </div>
      <Card title="My Uploads">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : stats.recentImages.length > 0 ? (
          <>
            <div className="space-y-2 mb-4">
              {stats.recentImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/30 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {image.title || 'Untitled'}
                      </span>
                      {image.isShared && (
                        <Badge variant="primary" size="sm">
                          Shared
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/image/${image._id}`}
                      className="text-luxury-indigo dark:text-luxury-glow hover:text-luxury-teal dark:hover:text-luxury-cyan text-sm font-medium transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-200/70 dark:border-white/10">
              <Button
                variant="primary"
                onClick={() => navigate('/gallery')}
                className="w-full"
              >
                View All My Uploads →
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-slate-400 dark:text-gray-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-gray-400 mb-4">
              No images uploaded yet
            </p>
            <Link to="/upload">
              <Button variant="primary">Upload Your First Image</Button>
            </Link>
          </div>
        )}
      </Card>
      <Card title="Profile Card" variant="glass">
        <div className="space-y-4">
          <div>
            <span className="font-medium text-slate-600 dark:text-gray-400">
              Name:
            </span>{' '}
            <span className="text-slate-900 dark:text-white">
              {user?.name || 'N/A'}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-600 dark:text-gray-400">
              Email:
            </span>{' '}
            <span className="text-slate-900 dark:text-white">
              {user?.email || 'N/A'}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-600 dark:text-gray-400">
              Role:
            </span>{' '}
            <Badge variant={user?.role === 'admin' ? 'primary' : 'default'}>
              {user?.role || 'user'}
            </Badge>
          </div>
          <Link to="/profile">
            <Button variant="ghost" className="mt-4">
              Edit Profile →
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
