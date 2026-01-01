import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useMedia } from '../hooks/useMedia';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import { getImageUrl } from '../utils/imageUrl';

const ImageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteImage } = useMedia();
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchImage();
    fetchAllImages();
  }, [id]);

  const fetchImage = async () => {
    try {
      const response = await api.get(`/api/media/${id}`);
      setImage(response.data.data);
    } catch (error) {
      showToast('Failed to load image', 'error');
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllImages = async () => {
    try {
      const response = await api.get('/api/media');
      const images = response.data.data || [];
      setAllImages(images);
      const index = images.findIndex((img) => img._id === id);
      if (index !== -1) setCurrentIndex(index);
    } catch (error) {
      console.error('Failed to fetch all images:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteImage(id);
      showToast('Image deleted successfully', 'success');
      navigate('/gallery');
    } catch (error) {
      showToast('Failed to delete image', 'error');
    }
    setShowDeleteModal(false);
  };

  const goToNext = () => {
    if (currentIndex < allImages.length - 1) {
      const nextId = allImages[currentIndex + 1]._id;
      navigate(`/image/${nextId}`);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevId = allImages[currentIndex - 1]._id;
      navigate(`/image/${prevId}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton variant="image" className="h-96" />
      </div>
    );
  }

  if (!image) {
    return null;
  }

  const ownerId = image.ownerId?._id || image.ownerId;
  const isOwner = ownerId === user?.id;
  const isAdmin = user?.role === 'admin';
  const canManage = isOwner || isAdmin;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={() => navigate('/gallery')}>
          ← Back to Gallery
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="primary"
            onClick={() => setShowFullscreen(true)}
          >
            View Fullscreen
          </Button>
          {canManage ? (
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          ) : (
            image.isShared && (
              <span className="text-sm text-gray-500 flex items-center">
                Shared (view only)
              </span>
            )
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(image.url)}
                  alt={image.title || 'Image'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">Image not available</span>
                </div>
              </div>
              {allImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="secondary"
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className="opacity-75 hover:opacity-100"
                  >
                    ← Prev
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={goToNext}
                    disabled={currentIndex === allImages.length - 1}
                    className="opacity-75 hover:opacity-100"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Metadata">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {image.title || 'Untitled'}
                </h3>
                {image.isShared && (
                  <Badge variant="primary" className="mt-2">
                    Shared
                  </Badge>
                )}
              </div>
              {image.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Description:
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {image.description}
                  </p>
                </div>
              )}
              {image.tags && image.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag, idx) => (
                      <Badge key={idx} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(image.createdAt).toLocaleString()}
                </p>
                {image.updatedAt && (
                  <p>
                    <span className="font-medium">Updated:</span>{' '}
                    {new Date(image.updatedAt).toLocaleString()}
                  </p>
                )}
                {image.ownerId && (
                  <p>
                    <span className="font-medium">Owner:</span>{' '}
                    {image.ownerId.name || image.ownerId.email}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showFullscreen}
        onClose={() => setShowFullscreen(false)}
        size="xl"
        className="max-w-7xl"
      >
        <div className="relative">
          <div className="bg-black rounded-lg overflow-hidden">
            {image.url?.startsWith('http') ? (
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-white">
                Image not available
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="secondary"
                onClick={goToPrev}
                disabled={currentIndex === 0}
              >
                ← Prev
              </Button>
              <Button
                variant="secondary"
                onClick={goToNext}
                disabled={currentIndex === allImages.length - 1}
              >
                Next →
              </Button>
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-white">{image.title || 'Untitled'}</p>
            <p className="text-sm text-gray-400">
              {currentIndex + 1} of {allImages.length}
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Image"
      >
        <p className="mb-4">
          Are you sure you want to delete this image? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ImageDetail;
