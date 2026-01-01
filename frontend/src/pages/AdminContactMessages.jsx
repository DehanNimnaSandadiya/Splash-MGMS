import { useState, useEffect } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useToast } from '../components/ui/Toast';
import MessageList from '../components/contact/MessageList';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const { getAllMessages, deleteMessageAdmin, replyToMessage, loading } = useContacts();
  const { showToast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch (error) {
      showToast('Failed to load messages', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    try {
      await deleteMessageAdmin(id);
      showToast('Message deleted successfully', 'success');
      loadMessages();
    } catch (error) {
      showToast('Failed to delete message', 'error');
    }
  };

  const handleReply = async (id, message) => {
    try {
      await replyToMessage(id, message);
      showToast('Reply sent successfully', 'success');
      loadMessages();
    } catch (error) {
      showToast('Failed to send reply', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
        Contact Messages
      </h1>
      <Card variant="glass">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <MessageList
            messages={messages}
            onDelete={handleDelete}
            onReply={handleReply}
            loading={false}
            isAdmin={true}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminContactMessages;
