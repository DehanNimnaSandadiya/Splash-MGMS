import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMedia } from '../hooks/useMedia';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

const ZipDownload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(
    location.state?.imageIds || []
  );
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchMedia, downloadZip } = useMedia();
  const { showToast } = useToast();

  useEffect(() => {
    if (selectedIds.length > 0) {
      loadSelectedImages();
    }
  }, []);

  const loadSelectedImages = async () => {
    try {
      const allImages = await fetchMedia({});
      const selected = allImages.filter((img) => selectedIds.includes(img._id));
      setImages(selected);
    } catch (error) {
      showToast('Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (selectedIds.length === 0) {
      showToast('Please select images to download', 'warning');
      return;
    }
    try {
      await downloadZip(selectedIds);
      showToast('ZIP file downloaded successfully', 'success');
    } catch (error) {
      showToast('Failed to download ZIP', 'error');
    }
  };

  const removeImage = (id) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ZIP Download</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/gallery')}>
            Back to Gallery
          </Button>
          <Button
            onClick={handleDownload}
            disabled={selectedIds.length === 0}
          >
            Download ZIP ({selectedIds.length})
          </Button>
        </div>
      </div>

      <Card>
        {images.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {images.length} image(s) selected for download
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {images.map((image) => (
                <div
                  key={image._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {image.url?.startsWith('http') ? (
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.title || 'Untitled'}
                      </p>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {image.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="default" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeImage(image._id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No images selected</p>
            <Button onClick={() => navigate('/gallery')}>
              Go to Gallery
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ZipDownload;
