import express from "express";
import { authenticateToken } from '../../middleware/authenticateToken.js'; 
import { addTrainiDayToTrainingPlan, deleteTrainingDay, getAllTrainingDays, updateTrainignDay } from "../../controllers/trainings/trainingDaysController.js";

const router = express.Router();

router.get('/getTrainingDays', authenticateToken, async (req, res) => {
    try {
        const { trainingPlanId } = req.query;

		if (!trainingPlanId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
		
        // Get training days
        const result = await getAllTrainingDays(trainingPlanId);

		// Send status to client
		if(result.status){
			console.log(`Data for ${trainingPlanId} training plan has been gotten successfully`);
			res.status(200).json({
				trainingPlanId: trainingPlanId,
				trainingDaysData: result
			})
		} else{
			console.log(`Can't get training days for ${trainingPlanId} trining plan`);
			res.status(404).json({
				trainingPlanId: trainingPlanId,
				trainingDaysData: null,
				message: `Can't get training days for ${trainingPlanId}`
			})
		}
    } catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/addTrainingDay', authenticateToken, async (req, res) => {
    try {
		const { trainingPlanId, dayName, dayDescription } = req.body;

		if (!trainingPlanId || !dayName || !dayDescription) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
		const result = await addTrainiDayToTrainingPlan(trainingPlanId, dayName, dayDescription);

		if(result.status){
			console.log(result.message);
			res.status(200).json({
				trainingPlanId: trainingPlanId,
				status: result.status
			})
		} else{
			console.log(result.message);
			res.status(404).json({
				trainingPlanId: trainingPlanId,
				status: result.status,
				message: result.message
			})
		}
    } catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
    }
})

router.put('/updateTrainingDays', authenticateToken, async (req, res) => {
    try {
		const { day_id, dayName, dayDescription } = req.body;

		if (!day_id || !dayName || !dayDescription) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
		const result = await updateTrainignDay(day_id, dayName, dayDescription);

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