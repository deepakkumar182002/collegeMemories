import express from 'express';
import {
  getMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
  reorderMemories,
} from '../controllers/memories.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getMemories);
router.patch('/reorder', protect, reorderMemories);
router.get('/:id', getMemoryById);

router.post('/', protect, upload.single('mediaFile'), createMemory);
router.put('/:id', protect, upload.single('mediaFile'), updateMemory);
router.delete('/:id', protect, deleteMemory);

export default router;
