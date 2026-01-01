import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useMedia } from '../hooks/useMedia';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: '',
    isShared: false,
  });
  const { uploadImage, loading } = useMedia();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(selectedFile.type)) {
      showToast('Only JPG and PNG images are allowed', 'error');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select an image', 'error');
      return;
    }

    try {
      const tagsArray = metadata.tags
        ? metadata.tags.split(',').map((t) => t.trim())
        : [];
      await uploadImage(file, {
        title: metadata.title || file.name,
        description: metadata.description,
        tags: tagsArray,
        isShared: metadata.isShared,
      });
      showToast('Image uploaded successfully', 'success');
      navigate('/gallery');
    } catch (error) {
      showToast('Upload failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
        Upload Image
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="glass">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-luxury-glow bg-luxury-glow/10 dark:bg-luxury-glow/20'
                : 'border-slate-300 dark:border-white/20 hover:border-luxury-glow/50 dark:hover:border-luxury-glow/50'
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {file?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {(file?.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-slate-600 dark:text-slate-300 mb-2">
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag & drop an image here, or click to select'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Supports: JPG, PNG (max 5MB)
                </p>
              </div>
            )}
          </div>
        </Card>
        <Card variant="glass">
          <h3 className="text-lg font-display font-semibold mb-4 text-slate-900 dark:text-white">
            Image Metadata
          </h3>
          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={metadata.title}
              onChange={(e) =>
                setMetadata({ ...metadata, title: e.target.value })
              }
              placeholder={file?.name || 'Enter title'}
            />
            <Textarea
              label="Description"
              name="description"
              value={metadata.description}
              onChange={(e) =>
                setMetadata({ ...metadata, description: e.target.value })
              }
              rows={3}
              placeholder="Enter description"
            />
            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={metadata.tags}
              onChange={(e) =>
                setMetadata({ ...metadata, tags: e.target.value })
              }
              placeholder="nature, landscape, photography"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isShared"
                checked={metadata.isShared}
                onChange={(e) =>
                  setMetadata({ ...metadata, isShared: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 focus:ring-2 border-slate-300 dark:border-slate-600"
              />
              <label
                htmlFor="isShared"
                className="ml-2 text-sm text-slate-700 dark:text-slate-300"
              >
                Share this image publicly
              </label>
            </div>
            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={!file || loading}
            >
              {loading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageUpload;
