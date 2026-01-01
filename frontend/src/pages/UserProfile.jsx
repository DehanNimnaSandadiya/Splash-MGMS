import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const UserProfile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/admin/users/${user.id}`, formData);
      showToast('Profile updated successfully', 'success');
      window.location.reload();
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
      <Card title="Profile Information">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Badge variant="primary">{user?.role || 'user'}</Badge>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UserProfile;
