import Contact from '../models/contact.model.js';
import { asyncHandler } from '../utils/errorHandler.util.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../utils/errorHandler.util.js';

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const userId = req.user?.userId || null;

  const contact = new Contact({
    name,
    email,
    message,
    userId,
  });

  await contact.save();

  return sendSuccess(
    res,
    201,
    {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      message: contact.message,
      createdAt: contact.createdAt,
    },
    'Contact message submitted successfully'
  );
});

export const getMyMessages = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = { userId: req.user.userId };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const messages = await Contact.find(query)
    .sort({ createdAt: -1 })
    .select('-__v');

  return sendSuccess(res, 200, messages, 'Your messages retrieved successfully');
});

export const getContactMessageById = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id).populate(
    'userId',
    'name email'
  );

  if (!message) {
    throw new AppError('Contact message not found', 404);
  }

  return sendSuccess(res, 200, message, 'Contact message retrieved successfully');
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message: messageText } = req.body;
  const contactMessage = await Contact.findById(req.params.id);

  if (!contactMessage) {
    throw new AppError('Contact message not found', 404);
  }

  if (
    contactMessage.userId &&
    contactMessage.userId.toString() !== req.user.userId &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Unauthorized to update this message', 403);
  }

  if (name !== undefined) contactMessage.name = name;
  if (email !== undefined) contactMessage.email = email;
  if (messageText !== undefined) contactMessage.message = messageText;

  await contactMessage.save();

  return sendSuccess(res, 200, contactMessage, 'Contact message updated successfully');
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (!message) {
    throw new AppError('Contact message not found', 404);
  }

  if (
    message.userId &&
    message.userId.toString() !== req.user.userId &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Unauthorized to delete this message', 403);
  }

  await Contact.findByIdAndDelete(req.params.id);

  return sendSuccess(res, 200, null, 'Contact message deleted successfully');
});

export const getAllContactMessages = asyncHandler(async (req, res) => {
  const { userId, search } = req.query;
  const query = {};

  if (userId) {
    query.userId = userId;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const messages = await Contact.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .select('-__v');

  return sendSuccess(res, 200, messages, 'All contact messages retrieved successfully');
});

export const deleteContactMessageAdmin = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (!message) {
    throw new AppError('Contact message not found', 404);
  }

  await Contact.findByIdAndDelete(req.params.id);

  return sendSuccess(res, 200, null, 'Contact message deleted successfully');
});

export const replyToContactMessage = asyncHandler(async (req, res) => {
  const { message: replyMessage } = req.body;
  const { id } = req.params;

  if (!replyMessage || !replyMessage.trim()) {
    throw new AppError('Reply message is required', 400);
  }

  if (replyMessage.trim().length > 1000) {
    throw new AppError('Reply message must be 1000 characters or less', 400);
  }

  const contactMessage = await Contact.findById(id);

  if (!contactMessage) {
    throw new AppError('Contact message not found', 404);
  }

  const reply = {
    message: replyMessage.trim(),
    repliedAt: new Date(),
    adminId: req.user.userId,
    adminName: req.user.name || 'Admin',
  };

  contactMessage.replies = contactMessage.replies || [];
  contactMessage.replies.push(reply);

  await contactMessage.save();

  return sendSuccess(
    res,
    200,
    contactMessage,
    'Reply added successfully'
  );
});