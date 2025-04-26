import TrainingDays from "../../models/trainings/trainingDays.js";

export async function getAllTrainingDays(req, res){
    const { trainingPlanId } = req.query;
    try {
        if (!trainingPlanId) return res.status(400).json({ message: 'Missing required fields' });

        const result = await TrainingDays.getAllTrainingDaysInTrainingPlan(trainingPlanId);
        if(!result) res.status(404).json({ trainingPlanId: trainingPlanId, trainingDaysData: null, message: `Can't get training days for ${trainingPlanId}`})

        return res.status(200).json({ trainingPlanId: trainingPlanId, trainingDaysData: result })
    } catch (error) {
        console.error(`Getting days for training plan with id ${trainingPlanId} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getTrainingDayData(req, res){
    const { trainingDayId } = req.query;
    try {
        if (!trainingDayId) return res.status(400).json({ message: 'Missing required fields' });

        const result = await TrainingDays.getTrainingDayById(trainingDayId);
        if(!result) return res.status(404).json({ trainingDayId: trainingDayId, trainingDaysData: null, message: `Getting training day data failed` })

        return res.status(200).json({ trainingDayId: trainingDayId, trainingDaysData: result });
    } catch (error) {
        console.error(`Getting days data with id ${trainingDayId} failed: `, error);
		return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function addTrainiDayToTrainingPlan(req, res){
    const { trainingPlanId, dayName, dayDescription } = req.body;
    try {
        if (!trainingPlanId || !dayName) return res.status(400).json({ message: 'Missing required fields' });

        const result = TrainingDays.addNewTrainingDayToTrainingPlan(trainingPlanId, dayName, dayDescription, 1);
        if(!result) return res.status(404).json({ trainingPlanId: trainingPlanId, status: result, message: 'Adding training plan failed' });

	    return res.status(200).json({ trainingPlanId: trainingPlanId, status: result, message: 'New training day has been added successfylly' });
    } catch (error) {
        console.error(`Adding day for training plan with id ${trainingPlanId} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateTrainignDay(req, res){
    const { day_id, dayName, dayDescription } = req.body;
    try {
        if (!day_id || !dayName || !dayDescription) return res.status(400).json({ message: 'Missing required fields' });

        const result = TrainingDays.updateTrainingDayInTrainingPlan(day_id, dayName, dayDescription, 1);
        if(!result) return res.status(404).json({ day_id: day_id, status: result, message: 'Training plan has not been updated' });

        return res.status(200).json({ day_id: day_id, status: result })
    } catch (error) {
        console.error(`Updating day with id ${day_id} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteTrainingDay(day_id){
    try {
        const result = TrainingDays.deleteTrainingDayFromTrainingPlan(day_id);

        return {
            status: !!result,
            message: result 
                ? `Training day for training plan ${day_id} has been deleted correctly`
                : `Training day for training plan ${day_id} has not been deleted due some error`
        }
    } catch (error) {
        console.error(`Error while deleting training day for ${day_id}`);
        return {
            status: false,
            data: null,
            message: `Error while deleting training day for ${day_id}`,
            errMessage: error
        }
    }
}