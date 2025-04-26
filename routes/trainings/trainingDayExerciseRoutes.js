import express from "express";
import { authenticateToken } from '../../middleware/authenticateToken.js';
import { addExerciseToTrainingDay, getExerciseById, deleteExercisesInDay, getExercisesInDay, updateExercisesInDay } from "../../controllers/trainings/trainingDayExerciseController.js";

const router = express.Router();

router.get('/getDayExercise', authenticateToken, getExercisesInDay)
router.get('/exercise', authenticateToken, getExerciseById);
router.post('/addDayExercise', authenticateToken, addExerciseToTrainingDay)
router.put('/updateDayExercise', authenticateToken, updateExercisesInDay)
router.delete('/deleteDayExercise', authenticateToken, deleteExercisesInDay)

export default router;