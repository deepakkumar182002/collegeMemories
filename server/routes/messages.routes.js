import express from 'express';
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messages.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', createMessage); // Public visitors or admin can pin sticky note to wall

router.put('/:id', protect, updateMessage);
router.delete('/:id', protect, deleteMessage);

export default router;
