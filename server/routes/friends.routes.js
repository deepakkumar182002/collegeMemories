import express from 'express';
import {
  getFriends,
  getFriendById,
  createFriend,
  updateFriend,
  deleteFriend,
  reorderFriends,
} from '../controllers/friends.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getFriends);
router.patch('/reorder', protect, reorderFriends);
router.get('/:id', getFriendById);

router.post('/', protect, upload.single('profileImage'), createFriend);
router.put('/:id', protect, upload.single('profileImage'), updateFriend);
router.delete('/:id', protect, deleteFriend);

export default router;
