import express from 'express';
import { authenticateToken } from '../../middleware/authenticateToken.js'; 
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/userControllers.js';

const router = express.Router();

export default router;