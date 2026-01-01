import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import { getImageUrl } from '../utils/imageUrl';

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState('');
  const [isShared, setIsShared] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (tags) params.append('tags', tags);
      if (isShared) params.append('isShared', isShared);
      if (ownerId) params.append('ownerId', ownerId);

      const response = await api.get(`/admin/media?${params.toString()}`);
      setMedia(response.data.data || []);
    } catch (error) {
      showToast('Failed to load media', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    loadMedia();
  };

  const toggleSelection = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media?')) {
      return;
    }
    try {
      await api.delete(`/admin/media/${id}`);
      showToast('Media deleted successfully', 'success');
      loadMedia();
    } catch (error) {
      showToast('Failed to delete media', 'error');
    }
  };

  const handleDeleteMultiple = async () => {
    try {
      for (const id of selectedImages) {
        await api.delete(`/admin/media/${id}`);
      }
      showToast(`${selectedImages.length} media deleted successfully`, 'success');
      setSelectedImages([]);
      setShowDeleteModal(false);
      loadMedia();
    } catch (error) {
      showToast('Failed to delete media', 'error');
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

  const handleDownloadSelected = async () => {
    try {
      const response = await api.post('/admin/media/zip', { ids: selectedImages }, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'selected-images.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Download started', 'success');
    } catch (error) {
      showToast('Failed to download images', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
          Admin Media Management
        </h1>
        <div className="flex space-x-2">
          {selectedImages.length > 0 && (
            <>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete ({selectedImages.length})
              </Button>
              <Button
                variant="primary"
                onClick={handleDownloadSelected}
              >
                Download ZIP ({selectedImages.length})
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleDownloadAll}>
            Download All ZIP
          </Button>
        </div>
      </div>

      <Card variant="glass">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="Search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Input
            label="Tags"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="nature, landscape"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Shared Status
            </label>
            <select
              value={isShared}
              onChange={(e) => setIsShared(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200/80 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-luxury-glow/50 focus:border-cyan-500/40 dark:focus:border-luxury-glow/50 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100"
            >
              <option value="">All</option>
              <option value="true">Shared</option>
              <option value="false">Private</option>
            </select>
          </div>
          <Input
            label="Owner ID (optional)"
            name="ownerId"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            placeholder="User ID"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSearch}>Apply Filters</Button>
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setTags('');
              setIsShared('');
              setOwnerId('');
              loadMedia();
            }}
          >
            Clear
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((image) => (
            <div
              key={image._id}
              className={`rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer ${
                selectedImages.includes(image._id)
                  ? 'ring-2 ring-luxury-indigo dark:ring-luxury-glow'
                  : ''
              }`}
              onClick={() => toggleSelection(image._id)}
            >
              <div className="relative h-48 w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
                <img
                  src={getImageUrl(image.url)}
                  alt={image.title || 'Image'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {selectedImages.includes(image._id) && (
                  <div className="absolute top-2 right-2 bg-luxury-indigo dark:bg-luxury-glow text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold z-10">
                    ✓
                  </div>
                )}
                {image.isShared && (
                  <Badge
                    variant="primary"
                    size="sm"
                    className="absolute top-2 left-2 z-10"
                  >
                    Shared
                  </Badge>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {image.title || 'Untitled'}
                </p>
                {image.ownerId && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Owner: {image.ownerId.name || image.ownerId.email || 'Unknown'}
                  </p>
                )}
                {image.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {image.description}
                  </p>
                )}
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {image.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {image.tags.length > 3 && (
                      <Badge variant="default" size="sm">
                        +{image.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <Link
                    to={`/image/${image._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-luxury-indigo dark:text-luxury-glow hover:underline font-medium"
                  >
                    View
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card variant="glass">
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">
            No media found
          </p>
        </Card>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Media"
      >
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Are you sure you want to delete {selectedImages.length} selected media?
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMultiple}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMedia;


