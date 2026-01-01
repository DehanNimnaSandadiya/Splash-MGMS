import { useState, useEffect } from 'react';
import api from '../utils/axios';

export const useMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedia = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.tags) {
        const tags = Array.isArray(filters.tags)
          ? filters.tags
          : filters.tags.split(',');
        tags.forEach((tag) => params.append('tags', tag.trim()));
      }
      if (filters.isShared !== undefined)
        params.append('isShared', filters.isShared);
      if (filters.personal !== undefined)
        params.append('personal', filters.personal);

      const response = await api.get(`/media?${params.toString()}`);
      setMedia(response.data.data || []);
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch media');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file, metadata = {}) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.description)
        formData.append('description', metadata.description);
      if (metadata.tags) {
        const tags = Array.isArray(metadata.tags)
          ? metadata.tags
          : metadata.tags.split(',');
        tags.forEach((tag) => formData.append('tags', tag.trim()));
      }
      if (metadata.isShared !== undefined)
        formData.append('isShared', metadata.isShared);

      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/media/${id}`, updates);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/media/${id}`);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMultipleImages = async (ids) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete('/media/multiple', { data: { imageIds: ids } });
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = async (ids) => {
    try {
      const response = await api.post(
        '/media/download-zip',
        { imageIds: ids },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'images.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Download failed');
      throw err;
    }
  };

  return {
    media,
    loading,
    error,
    fetchMedia,
    uploadImage,
    updateImage,
    deleteImage,
    deleteMultipleImages,
    downloadZip,
  };
};

