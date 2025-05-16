import TrainignHistory from "../../services/trainings/trainingHistory";

export async function getAllTrainingRecords(req, res) {
    const { id } = req.user;
    try {
        if(!id) return res.status(400).json({ message: 'Missed require fields'});

        const records = await TrainignHistory.getAllRecordsFromTrainingHistory(id);

        return res.status(200).json({
            message: 'Exercise records fetched successfully',
            data: records || []
        });
    } catch (error) {
        console.error(`Getting all training record for ${id} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getHistoryRecordByExercise(req, res){
    const { id } = req.user;
    try {
        const { exercise_id } = req.body;
        if(!id || !exercise_id) return res.status(400).json({ message: 'Missed require fields' });

        const result = false;

        return res.status(200).json({
            message: 'Exercise records fetched successfully',
            data: result || []
        });
    } catch (error) {
        console.error(`Getting all training record for ${id} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function addTrainingRecord(req, res) {
    const { id } = req.user;
    try {
        const { plan_id, 
            day_id, 
            exercise_id, 
            date, 
            completed, 
            sets_completed, 
            reps_completed, 
            weight_used, 
            notes } = req.body;
        if(!id || 
            !plan_id || 
            !day_id || 
            !exercise_id || 
            !date || 
            !completed || 
            !sets_completed || 
            !reps_completed || 
            !weight_used || 
            !notes) return res.status(400).json({ message: 'Missed require fields'});

        const result = await TrainignHistory.addRecordToTrainingHistory(id, plan_id, day_id, exercise_id, date, completed, sets_completed, reps_completed, weight_used, notes);
        if(!result) return res.status(401).json({ message: 'Training record has not been added' });
        
        return res.status(201).json({ message: 'Training record has been added'});
    } catch (error) {
        console.error(`Adding training record for ${id} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateTrainingRecord(req, res) {
    const { id } = req.user;
    try {
        const { history_id, 
            sets_completed, 
            reps_completed, 
            weight_used, 
            notes } = req.body;
        if(!id ||
            !history_id ||
            !sets_completed || 
            !reps_completed || 
            !weight_used || 
            !notes) return res.status(400).json({ message: 'Missed require fields'});

        const result = await TrainignHistory.addRecordToTrainingHistory(history_id, sets_completed, reps_completed, weight_used, notes);
        if(!result) return res.status(401).json({ message: 'Training record has not been updated' });
        
        return res.status(201).json({ message: 'Training record has been added'});
    } catch (error) {
        console.error(`Updating training record for ${id} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteTrainingRecord(req, res) {
    const { id } = req.user
    try {
        const { history_id } = req.body;
        if(!id || !history_id) return res.status(400).json({ message: 'Missed require fields'});

        const result = await TrainignHistory.deleteRecordFromTrainingHistory(history_id);
        if(!result) return res.status(404).json({ message: `Training record with id ${history_id} has not been deleted`} );

        return res.status(200).json({ message: `Training record with id ${history_id} has been deleted` })
    } catch (error) {
        console.error(`Deleting training record for ${id} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}