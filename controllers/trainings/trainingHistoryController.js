import TrainingHistory from "../../services/trainings/trainingHistory";
import { ApiError } from '../../utils/api/ApiError.js'
import { ApiSuccess } from "../../utils/api/ApiSuccess.js";
import { getMissingFields } from "../../utils/api/getMissingFields.js";

export async function getAllTrainingRecords(req, res, next) {
    const { id } = req.user;
    try {
        const records = await TrainingHistory.getAllRecordsFromTrainingHistory(id);

        return ApiSuccess(res, 200, records, 'All training records has been retrieved');
    } catch (error) {
        next(error);
    }
}

export async function getHistoryRecordByExercise(req, res, next) {
    const { id } = req.user;
    try {
        const { exercise_id } = req.body;
        if (!exercise_id) {
            throw new ApiError(400, `Missing required fields: exercise_id`);
        };

        const result = await TrainingHistory.getRecordByExercise(id, exercise_id);

        return ApiSuccess(res, 200, result, 'Exercise history has been retrieved');
    } catch (error) {
        next(error);
    }
}

export async function addTrainingRecord(req, res, next) {
    const { id } = req.user;
    const { plan_id,
        day_id,
        exercise_id,
        date,
        completed,
        sets_completed,
        reps_completed,
        weight_used,
        notes
    } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['plan_id', 'day_id', 'exercise_id', 'date', 'completed', 'sets_completed', 'reps_completed', 'weight_used', 'notes']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const result = await TrainingHistory.addRecordToTrainingHistory(id, plan_id, day_id, exercise_id, date, completed, sets_completed, reps_completed, weight_used, notes);
        if (!result) {
            throw new ApiError(500, `Training record has not been added`);
        };

        return ApiSuccess(res, 201, {}, 'Training record has been added');
    } catch (error) {
        next(error);
    }
}

export async function updateTrainingRecord(req, res, next) {
    const { history_id,
        sets_completed,
        reps_completed,
        weight_used,
        notes } = req.body;
    try {

        const missingFields = getMissingFields(req.body, ['history_id', 'sets_completed', 'reps_completed', 'weight_used', 'notes']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const result = await TrainingHistory.updateRecordInTrainingHistory(history_id, sets_completed, reps_completed, weight_used, notes);
        if (!result) {
            throw new ApiError(500, `Training record has not been updated`);
        };

        return ApiSuccess(res, 200, {}, 'Training record has been updated');
    } catch (error) {
        next(error);
    }
}

export async function deleteTrainingRecord(req, res, next) {
    const { id } = req.user
    const { history_id } = req.body;
    try {
        if (!history_id) {
            throw new ApiError(400, `Missing required fields: history_id`);
        };

        const result = await TrainingHistory.deleteRecordFromTrainingHistory(history_id);
        if (!result) {
            throw new ApiError(500, `Training record has not been deleted`);
        };

        return ApiSuccess(res, 200, {}, 'Training record has been deleted');
    } catch (error) {
        next(error);
    }
}