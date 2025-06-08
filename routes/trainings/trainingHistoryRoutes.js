import express from 'express'
import { saveTrainingProgress, getHistoryRecordByExercise } from '../../controllers/trainings/trainingHistoryController.js';
import { authenticateToken } from '../../middleware/authenticateToken.js';

const router = express.Router();

router.post('/saveTrainingProgress', authenticateToken, saveTrainingProgress);
router.get('/exerciseHistory', authenticateToken, getHistoryRecordByExercise)

export default router;