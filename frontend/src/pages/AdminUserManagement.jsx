import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Skeleton from '../components/ui/Skeleton';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true,
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data.data || []);
    } catch (error) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/admin/users/${editingUser._id}`, editForm);
      showToast('User updated successfully', 'success');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      showToast('Failed to update user', 'error');
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }
    try {
      await api.patch(`/api/admin/users/${userId}/deactivate`);
      showToast('User deactivated successfully', 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to deactivate user', 'error');
    }
  };

  const handleActivate = async (userId) => {
    try {
      await api.patch(`/api/admin/users/${userId}/activate`);
      showToast('User activated successfully', 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to activate user', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Card variant="glass">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
        User Management
      </h1>
      <Card>
        <Table>
          <Table.Head>
            <Table.Header>Name</Table.Header>
            <Table.Header>Email</Table.Header>
            <Table.Header>Role</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Actions</Table.Header>
          </Table.Head>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user._id}>
                <Table.Cell className="font-medium">{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Badge
                    variant={user.role === 'admin' ? 'primary' : 'default'}
                  >
                    {user.role}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    {user.isActive ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeactivate(user._id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleActivate(user._id)}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
          />
          <Select
            label="Role"
            name="role"
            value={editForm.role}
            onChange={(e) =>
              setEditForm({ ...editForm, role: e.target.value })
            }
            options={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={editForm.isActive}
              onChange={(e) =>
                setEditForm({ ...editForm, isActive: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 focus:ring-2 border-slate-300 dark:border-slate-600"
            />
            <label
              htmlFor="isActive"
              className="ml-2 text-sm text-slate-700 dark:text-slate-300"
            >
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;
