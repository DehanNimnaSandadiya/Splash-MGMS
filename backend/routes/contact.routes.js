import express from 'express';
import {
  submitContact,
  getMyMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
} from '../controllers/contact.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate, contactValidation } from '../utils/validation.util.js';

const router = express.Router();

router.post('/', authenticate, validate(contactValidation), submitContact);
router.get('/my-messages', authenticate, getMyMessages);
router.get('/:id', authenticate, getContactMessageById);
router.put('/:id', authenticate, updateContactMessage);
router.delete('/:id', authenticate, deleteContactMessage);

export default router;
