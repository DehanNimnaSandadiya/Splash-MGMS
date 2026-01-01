import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMedia } from '../hooks/useMedia';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import { getImageUrl } from '../utils/imageUrl';

const MediaGallery = () => {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { media, loading, fetchMedia, deleteMultipleImages } = useMedia();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadImages();
  }, [filterType]);

  const loadImages = async () => {
    const filters = {};
    if (search) filters.search = search;
    if (tags) filters.tags = tags;
    if (filterType === 'shared') filters.isShared = true;
    if (filterType === 'personal') filters.personal = true;
    await fetchMedia(filters);
  };

  const handleSearch = () => {
    loadImages();
  };

  const toggleSelection = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deletableSelectedIds = useMemo(() => {
    if (!user) return [];
    return selectedImages.filter((id) => {
      const image = media.find((img) => img._id === id);
      if (!image) return false;
      const ownerId = image.ownerId?._id || image.ownerId;
      const isOwner = ownerId === user.id;
      const isAdmin = user.role === 'admin';
      return isOwner || isAdmin;
    });
  }, [selectedImages, media, user]);

  const hasNonDeletableSelected = selectedImages.length > deletableSelectedIds.length;

  const handleDeleteMultiple = async () => {
    try {
      await deleteMultipleImages(deletableSelectedIds);
      showToast('Images deleted successfully', 'success');
      setSelectedImages([]);
      setShowDeleteModal(false);
      loadImages();
    } catch (error) {
      showToast(
        error.response?.data?.error || 'Failed to delete images',
        'error'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Media Gallery
        </h1>
        <div className="flex space-x-2 items-center">
          {selectedImages.length > 0 && (
            <>
              {deletableSelectedIds.length > 0 && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete ({deletableSelectedIds.length})
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => navigate('/zip-download', {
                  state: { imageIds: selectedImages },
                })}
              >
                Download ZIP ({selectedImages.length})
              </Button>
              {hasNonDeletableSelected && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Some selected items are shared (view-only)
                </span>
              )}
            </>
          )}
          <Link to="/upload">
            <Button>Upload Image</Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Search by Title"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Input
            label="Filter by Tags"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="nature, landscape"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200/80 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-luxury-glow/50 focus:border-cyan-500/40 dark:focus:border-luxury-glow/50 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Images</option>
              <option value="personal">Personal Only</option>
              <option value="shared">Shared Only</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSearch}>Apply Filters</Button>
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setTags('');
              setFilterType('all');
              loadImages();
            }}
          >
            Clear
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="image" />
          ))}
        </div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((image) => (
            <div
              key={image._id}
              className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer ${
                selectedImages.includes(image._id)
                  ? 'ring-2 ring-primary-500'
                  : ''
              }`}
              onClick={() => toggleSelection(image._id)}
            >
              <div className="relative h-48 w-full bg-slate-50 overflow-hidden">
                <img
                  src={getImageUrl(image.url)}
                  alt={image.title || 'Image'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500 text-sm">
                    {image.title || 'Image'}
                  </span>
                </div>
                {selectedImages.includes(image._id) && (
                  <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold z-10">
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
                <p className="text-base font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">
                  {image.title || 'Untitled'}
                </p>
                {image.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
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
                    className="text-sm text-primary-600 hover:underline font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No images found. Upload your first image!
          </p>
        </Card>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Images"
      >
        <p className="mb-4">
          Are you sure you want to delete {selectedImages.length} image(s)? This
          action cannot be undone.
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

export default MediaGallery;
