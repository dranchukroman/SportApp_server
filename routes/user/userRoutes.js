import express from 'express';
import { authenticateToken } from '../../middleware/authenticateToken.js'; 
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from '../../controllers/user/userProfileControllers.js';

const router = express.Router();

// User profile routes
router.post('/createProfile', authenticateToken, createUserProfile);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/updateProfile', authenticateToken, updateUserProfile);
router.delete('/deleteProfile', authenticateToken, deleteUserProfile);

export default router;