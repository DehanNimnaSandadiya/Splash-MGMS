import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Image, Share2, Mail, Download, FileText } from 'lucide-react';
import api from '../utils/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
      setLastUpdated(new Date());
    } catch (error) {
      showToast('Failed to load statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      const response = await api.post('/admin/media/zip', {}, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all-images.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Download started', 'success');
    } catch (error) {
      showToast('Failed to download images', 'error');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get('/admin/reports/analytics.txt', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'analytics-report.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Report downloaded successfully', 'success');
    } catch (error) {
      showToast('Failed to download report', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          Manage users, media, and system analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" className="hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/30">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-indigo/20 to-luxury-teal/20 mb-4">
                <Users className="w-7 h-7 text-luxury-indigo dark:text-luxury-glow" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                Total Users
              </p>
              <p className="text-4xl font-display font-bold text-luxury-indigo dark:text-luxury-glow">
                {stats?.users?.total || 0}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" className="hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/30">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-teal/20 to-luxury-cyan/20 mb-4">
                <Image className="w-7 h-7 text-luxury-teal dark:text-luxury-cyan" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                Total Media
              </p>
              <p className="text-4xl font-display font-bold text-luxury-teal dark:text-luxury-cyan">
                {stats?.media?.total || 0}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/30">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-indigo/20 to-luxury-teal/20 mb-4">
                <Share2 className="w-7 h-7 text-luxury-indigo dark:text-luxury-glow" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                Shared Media
              </p>
              <p className="text-4xl font-display font-bold text-luxury-indigo dark:text-luxury-glow">
                {stats?.media?.shared || 0}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass" className="hover:border-luxury-indigo/30 dark:hover:border-luxury-glow/30">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-teal/20 to-luxury-cyan/20 mb-4">
                <Mail className="w-7 h-7 text-luxury-teal dark:text-luxury-cyan" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                Contact Messages
              </p>
              <p className="text-4xl font-display font-bold text-luxury-teal dark:text-luxury-cyan">
                {stats?.contacts?.total || 0}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <h3 className="text-lg font-display font-semibold mb-4 text-slate-900 dark:text-white">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/admin/media')}
            >
              <Image className="w-4 h-4 mr-2" />
              Manage Media
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/admin/contacts')}
            >
              <Mail className="w-4 h-4 mr-2" />
              View Contact Messages
            </Button>
          </div>
        </Card>

        <Card variant="glass">
          <h3 className="text-lg font-display font-semibold mb-4 text-slate-900 dark:text-white">
            Downloads & Reports
          </h3>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleDownloadAll}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All Images (ZIP)
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleDownloadReport}
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Report (.txt)
            </Button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

