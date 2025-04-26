import DayExercises from "../../models/trainings/dayExercises.js";

export async function getExercisesInDay(req, res){
    const { day_id } = req.query;
    try {
        if (!day_id) return res.status(400).json({ message: 'Missing required fields' });

        const result = await DayExercises.getAllExericsesInDay(day_id);
        if(!result) return res.status(404).json({ day_id: day_id, exerciseData: null, message: `Can't get training days for ${day_id}` })

        return res.status(200).json({ day_id: day_id, exerciseData: result})
    } catch (error) {
        console.error(`Getting all exercises for day ${day_id} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getExerciseById(req, res){
    const { exerciseId } = req.query;
    try {
        if (!exerciseId) return res.status(400).json({ message: 'Missing required fields' });

        const result = await DayExercises.getExerciseById(exerciseId);
        if(!result) return res.status(404).json({ exerciseId, message: `Exercise with id ${exerciseId} do not exist` });

        return res.status(200).json({ exerciseId, data: result });
    } catch (error) {
        console.error(`Getting exercise by id ${exerciseId} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function addExerciseToTrainingDay(req, res){
    const { email } = req.user;
    const { day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight } = req.body;
    try {
		if (!day_id || !exercise_id || !muscle_group) return res.status(400).json({ message: 'Missing required fields' });

        const result = await DayExercises.addExerciseToDay(day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight);
        if(!result) return res.status(401).json({ day_id, status: result, message: `New exercise has not been added`});

        return res.status(201).json({ day_id: day_id, status: result.status })
    } catch (error) {
        console.error(`Adding exericse for ${email} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateExercisesInDay(req, res){
    const { muscle_group, rest_time, sets, reps, weight, day_exercise_id, exercise_id, description } = req.body;
    try {
        if (!muscle_group || !rest_time || !sets || !reps || !weight || !day_exercise_id || !exercise_id) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

        const result = await DayExercises.updateExerciseInDay(muscle_group, rest_time, sets, reps, weight, day_exercise_id, exercise_id, description);
        if(!result) return res.status(401).json({ day_exercise_id, status: result});

        return res.status(200).json({ day_exercise_id, status: result});
    } catch (error) {
        console.error(`Updating exericse with id ${day_exercise_id} for ${email} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export async function deleteExercisesInDay(req, res){
    const { email } = req.user;
    const { day_exercise_id } = req.body;
    try {
        if (!day_exercise_id) return res.status(400).json({ message: 'Missing required fields' });

        const result = await DayExercises.deleteExerciseInDay(day_exercise_id)
        if(!result) return res.status(401).json({ day_exercise_id, status: result, message: 'Deleting exercise failed'});
        
        return res.status(200).json({ day_exercise_id, status: result, message: 'Exercise has been deleted'});
    } catch (error) {
        console.error(`Deleting exericse with id ${day_exercise_id} for ${email} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}