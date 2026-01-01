import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Badge from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';

const MessageList = ({
  messages,
  onEdit,
  onDelete,
  onReply,
  loading = false,
  isAdmin = false,
}) => {
  const { user } = useAuth();
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editForm, setEditForm] = useState({ name: '', email: '', message: '' });

  const handleEditClick = (message) => {
    setEditingMessage(message);
    setEditForm({
      name: message.name,
      email: message.email,
      message: message.message,
    });
  };

  const handleEditSubmit = () => {
    if (editingMessage) {
      onEdit(editingMessage._id, editForm);
      setEditingMessage(null);
    }
  };

  const handleReplyClick = (message) => {
    setReplyingTo(message);
    setReplyText('');
  };

  const handleReplySubmit = () => {
    if (replyingTo && replyText.trim() && onReply) {
      onReply(replyingTo._id, replyText.trim());
      setReplyingTo(null);
      setReplyText('');
    }
  };

  if (loading) {
    return (
      <Card variant="glass">
        <p className="text-center text-slate-600 dark:text-slate-400 py-8">
          Loading messages...
        </p>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card variant="glass">
        <p className="text-center text-slate-600 dark:text-slate-400 py-8">
          No messages found
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message._id} variant="glass">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {message.name}
                </h3>
                {isAdmin && message.userId && (
                  <Badge variant="primary" size="sm">
                    User: {message.userId.name || message.userId.email}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {message.email}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleReplyClick(message)}
                >
                  Reply
                </Button>
              )}
              {(!isAdmin || message.userId?.toString() === user?.id) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(message)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(message._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
              {isAdmin && message.userId?.toString() !== user?.id && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(message._id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
            {message.message}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {new Date(message.createdAt).toLocaleString()}
          </p>
          
          {/* Display Replies */}
          {message.replies && message.replies.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-white/10">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Admin Replies:
              </h4>
              <div className="space-y-3">
                {message.replies.map((reply, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 border border-slate-200/50 dark:border-white/10"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                        {reply.adminName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(reply.repliedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {reply.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}

      <Modal
        isOpen={!!editingMessage}
        onClose={() => setEditingMessage(null)}
        title="Edit Message"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={editForm.message}
              onChange={(e) =>
                setEditForm({ ...editForm, message: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setEditingMessage(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={!!replyingTo}
        onClose={() => {
          setReplyingTo(null);
          setReplyText('');
        }}
        title="Reply to Message"
      >
        <div className="space-y-4">
          <Textarea
            label="Reply Message"
            name="reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={6}
            placeholder="Enter your reply..."
            required
            maxLength={1000}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {replyText.length}/1000 characters
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReplySubmit}
              disabled={!replyText.trim()}
            >
              Send Reply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MessageList;

