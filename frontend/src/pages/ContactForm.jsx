import { useState, useEffect } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useToast } from '../components/ui/Toast';
import ContactFormComponent from '../components/contact/ContactForm';
import MessageList from '../components/contact/MessageList';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ContactForm = () => {
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const { submitContact, getMyMessages, updateMessage, deleteMessage, loading } =
    useContacts();
  const { showToast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMyMessages();
      setMessages(data);
    } catch (error) {
      showToast('Failed to load messages', 'error');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await submitContact(formData);
      showToast('Message sent successfully', 'success');
      loadMessages();
    } catch (error) {
      showToast('Failed to send message', 'error');
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await updateMessage(id, data);
      showToast('Message updated successfully', 'success');
      loadMessages();
    } catch (error) {
      showToast('Failed to update message', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    try {
      await deleteMessage(id);
      showToast('Message deleted successfully', 'success');
      loadMessages();
    } catch (error) {
      showToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
          Contact Us
        </h1>
        <Button
          variant="outline"
          onClick={() => setShowMessages(!showMessages)}
        >
          {showMessages ? 'Hide' : 'Show'} My Messages ({messages.length})
        </Button>
      </div>

      {!showMessages ? (
        <ContactFormComponent onSubmit={handleSubmit} loading={loading} />
      ) : (
        <div className="space-y-4">
          <Card variant="glass">
            <h2 className="text-xl font-display font-semibold mb-4 text-slate-900 dark:text-white">
              My Messages
            </h2>
            <MessageList
              messages={messages}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
              isAdmin={false}
            />
          </Card>
          <Button variant="outline" onClick={() => setShowMessages(false)}>
            Submit New Message
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
