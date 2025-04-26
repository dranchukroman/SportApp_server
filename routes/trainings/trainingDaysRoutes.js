import express from "express";
import { authenticateToken } from '../../middleware/authenticateToken.js'; 
import { addTrainiDayToTrainingPlan, getTrainingDayData, deleteTrainingDay, getAllTrainingDays, updateTrainignDay } from "../../controllers/trainings/trainingDaysController.js";

const router = express.Router();

router.get('/getTrainingDays', authenticateToken, getAllTrainingDays)
router.get('/trainingDay', authenticateToken, getTrainingDayData)
router.post('/addTrainingDay', authenticateToken, addTrainiDayToTrainingPlan)

router.put('/updateTrainingDays', authenticateToken, updateTrainignDay)

router.delete('/deleteTrainingDays', authenticateToken, async (req, res) => {
    try {
		const { day_id } = req.body;
		
		if (!day_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
		const result = await deleteTrainingDay(day_id);

		if(result.status){
			console.log(result.message);
			res.status(200).json({
				day_id: day_id,
				status: result.status
			})
		} else{
			console.log(result.message);
			res.status(404).json({
				day_id: day_id,
				status: result.status,
				message: result.message
			})
		}
    } catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;