import { useState } from 'react';
import api from '../utils/axios';

export const useContacts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitContact = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/contact', data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMyMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/contact/my-messages');
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/admin/contacts');
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/contact/${id}`, data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/contact/${id}`);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessageAdmin = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/contacts/${id}`);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const replyToMessage = async (id, message) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/api/admin/contacts/${id}/reply`, { message });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reply to message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitContact,
    getMyMessages,
    getAllMessages,
    updateMessage,
    deleteMessage,
    deleteMessageAdmin,
    replyToMessage,
  };
};

