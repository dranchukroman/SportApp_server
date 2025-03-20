import express from "express";
import { authenticateToken } from '../../middleware/authenticateToken.js';
import { addExerciseToTrainingDay, getExerciseById, deleteExercisesInDay, getExercisesInDay, updateExercisesInDay } from "../../controllers/trainings/trainingDayExerciseController.js";

const router = express.Router();

router.get('/getDayExercise', authenticateToken, async (req, res) => {
	try {
		const { day_id } = req.query;

		if (!day_id) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		// Get exercise in training day
		const result = await getExercisesInDay(day_id);

		if (result.status) {
			console.log(`Data for exersise in training day: ${day_id} has been gotten successfully`);
			res.status(200).json({
				day_id: day_id,
				exerciseData: result
			})
		} else {
			console.log(`Can't get exercise in day ${day_id}`);
			res.status(404).json({
				day_id: day_id,
				exerciseData: null,
				message: `Can't get training days for ${day_id}`
			})
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
})

router.get('/exercise', authenticateToken, async (req, res) => {
	try {
		const { exerciseId } = req.query;

		if (!exerciseId) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const result = await getExerciseById(exerciseId);

		if(result.status){
			res.status(200).json({
				exerciseId,
				data: result.data
			});
		} else {
			res.status(404).json({
				exerciseId,
				message: `Cant't get exercise by id ${exerciseId}`
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

router.post('/addDayExercise', authenticateToken, async (req, res) => {
	try {
		const { day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight } = req.body;

		if (!day_id || !exercise_id || !muscle_group || !description || !rest_time || !sets || !reps || !weight) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const result = await addExerciseToTrainingDay(day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight);

		if (result.status) {
			console.log(`Data for exersise in training day: ${day_id} has been added successfully`);
			res.status(201).json({
				day_id: day_id,
				status: result.status
			})
		} else {
			console.log(`Can't add exercise for day ${day_id}`);
			res.status(404).json({
				day_id: day_id,
				status: result.status,
				message: `Can't get training days for ${day_id}`
			})
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
})

router.put('/updateDayExercise', authenticateToken, async (req, res) => {
	try {
		const { muscle_group, rest_time, sets, reps, weight, day_exercise_id, exercise_id } = req.body;

		if (!muscle_group || !rest_time || !sets || !reps || !weight || !day_exercise_id || !exercise_id) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const result = await updateExercisesInDay(muscle_group, rest_time, sets, reps, weight, day_exercise_id, exercise_id);

		if (result.status) {
			console.log(`Exercise with ${day_exercise_id} has been updated`);
			res.status(200).json({
				day_exercise_id,
				status: result.status
			})
		} else {
			console.log(`Exercise with ${day_exercise_id} has not been updated`);
			res.status(404).json({
				day_exercise_id,
				status: result.status
			})
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
})

router.delete('/deleteDayExercise', authenticateToken, async (req, res) => {
	try {
		const { day_exercise_id } = req.body;

		if (!day_exercise_id) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const result = await deleteExercisesInDay(day_exercise_id);

		if (result.status) {
			console.log(`Exercise with ${day_exercise_id} has been deleted`);
			res.status(200).json({
				day_exercise_id,
				status: result.status
			})
		} else {
			console.log(`Exercise with ${day_exercise_id} has not been deleted`);
			res.status(404).json({
				day_exercise_id,
				status: result.status
			})
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
})

export default router;