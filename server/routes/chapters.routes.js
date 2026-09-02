import express from 'express';
import {
  getChapters,
  getChapterBySlugOrId,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
} from '../controllers/chapters.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getChapters);
router.patch('/reorder', protect, reorderChapters);
router.get('/:slug', getChapterBySlugOrId);

router.post('/', protect, upload.single('coverImage'), createChapter);
router.put('/:id', protect, upload.single('coverImage'), updateChapter);
router.delete('/:id', protect, deleteChapter);

export default router;
