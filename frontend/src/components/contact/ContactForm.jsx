import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const ContactForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows="6"
              className="w-full px-4 py-3 border border-slate-300 dark:border-white/25 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-luxury-glow/50 focus:border-cyan-500/40 dark:focus:border-luxury-glow/50 bg-white dark:bg-white/5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400"
              required
            />
          </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Message'}
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm;

