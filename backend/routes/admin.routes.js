import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  getStats,
  getAllMedia,
  deleteMediaAdmin,
  getAnalytics,
  downloadAllMediaZip,
  downloadAnalyticsReport,
} from '../controllers/admin.controller.js';
import {
  getAllContactMessages,
  deleteContactMessageAdmin,
  replyToContactMessage,
} from '../controllers/contact.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin']));

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.patch('/users/:id/deactivate', deleteUser);
router.patch('/users/:id/activate', activateUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/contacts', getAllContactMessages);
router.delete('/contacts/:id', deleteContactMessageAdmin);
router.post('/contacts/:id/reply', replyToContactMessage);
router.get('/media', getAllMedia);
router.delete('/media/:id', deleteMediaAdmin);
router.post('/media/zip', downloadAllMediaZip);
router.get('/reports/analytics.txt', downloadAnalyticsReport);

export default router;

