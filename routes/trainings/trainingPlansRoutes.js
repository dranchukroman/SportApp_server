import express from 'express';
import { authenticateToken } from '../../middleware/authenticateToken.js'; 
import { 
    getAllTrainingPlans, 
    getTrainingPlanById, 
    addNewTrainingPlan, 
    deleteTrainingPlan, 
    updateTrainingPlan 
} from '../../controllers/trainings/trainingPlansController.js';

const router = express.Router();

// Route to get training plans
router.get('/trainingPlans', authenticateToken, getAllTrainingPlans);
router.get('/trainingPlan', authenticateToken, getTrainingPlanById);
router.post('/addTrainingPlan', authenticateToken, addNewTrainingPlan);
router.delete('/deleteTrainingPlan', authenticateToken, deleteTrainingPlan);
router.put('/updateTrainingPlan', authenticateToken, updateTrainingPlan);

export default router;