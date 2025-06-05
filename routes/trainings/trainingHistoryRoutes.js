import express from 'express'
import { saveTrainingProgress } from '../../controllers/trainings/trainingHistoryController.js';
import { authenticateToken } from '../../middleware/authenticateToken.js';

const router = express.Router();

router.post('/saveTrainingProgress', authenticateToken, saveTrainingProgress);

export default router;