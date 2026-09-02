import express from 'express';
import {
  addReaction,
  addComment,
  getComments,
  getStats,
  deleteComment,
} from '../controllers/interaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Interaction Routes
router.post('/react', addReaction);
router.post('/comments', addComment);
router.get('/comments/:targetType/:targetId', getComments);
router.get('/stats/:targetType/:targetId', getStats);

// Protected Admin Routes
router.delete('/comments/:id', protect, deleteComment);

export default router;
