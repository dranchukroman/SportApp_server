import express from "express";
import { authenticateToken } from '../../middleware/authenticateToken.js'; 
import { addTrainingDayToTrainingPlan, getTrainingDayData, deleteTrainingDay, getAllTrainingDays, updateTrainignDay } from "../../controllers/trainings/trainingDaysController.js";

const router = express.Router();

router.get('/getTrainingDays', authenticateToken, getAllTrainingDays)
router.get('/trainingDay', authenticateToken, getTrainingDayData)
router.post('/addTrainingDay', authenticateToken, addTrainingDayToTrainingPlan)
router.put('/updateTrainingDays', authenticateToken, updateTrainignDay)
router.delete('/deleteTrainingDays', authenticateToken, deleteTrainingDay)

export default router;