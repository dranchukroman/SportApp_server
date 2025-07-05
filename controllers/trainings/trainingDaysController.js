import TrainingDays from "../../services/trainings/trainingDays.js";
import TrainingPlans from "../../services/trainings/trainingPlans.js";
import { ApiError } from "../../utils/api/ApiError.js";
import { ApiSuccess } from "../../utils/api/ApiSuccess.js";
import { getMissingFields } from "../../utils/api/getMissingFields.js";

export async function getAllTrainingDays(req, res, next) {
    const trainingPlanId = Number(req.query.trainingPlanId);
    try {
        if (!trainingPlanId) {
            throw new ApiError(400, `Missing required fields: trainingPlanId`);
        };

        const planExist = await TrainingPlans.checkIfPlanExist(trainingPlanId);
        if (!planExist) {
            throw new ApiError(404, `Plan with id ${trainingPlanId} not found`);
        }

        const trainingDays = await TrainingDays.getAllTrainingDaysInTrainingPlan(trainingPlanId);

        return ApiSuccess(res, 200, { trainingPlanId, trainingDays }, 'Training days have been retrieved')
    } catch (error) {
        next(error);
    }
}

export async function getTrainingDayData(req, res, next) {
    const trainingDayId = Number(req.query.trainingDayId);
    try {
        if (!trainingDayId) {
            throw new ApiError(400, `Missing required fields: trainingDayId`);
        };

        const dayExist = await TrainingDays.checkIfDayExist(trainingDayId);
        if (!dayExist) {
            throw new ApiError(404, `Day with id ${trainingDayId} not found`);
        }

        const trainingDay = await TrainingDays.getTrainingDayById(trainingDayId);

        return ApiSuccess(res, 200, { trainingDayId, trainingDay, }, 'Training day retrieved successfully')
    } catch (error) {
        next(error);
    }
}

export async function addTrainingDayToTrainingPlan(req, res, next) {
    const planId = Number(req.body.planId);
    const { name, description } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['planId', 'name']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const planExist = await TrainingPlans.checkIfPlanExist(planId);
        if (!planExist) {
            throw new ApiError(404, `Plan with id ${planId} not found`);
        }

        const insertedDayId = await TrainingDays.addNewTrainingDayToTrainingPlan(planId, name, description, 1); // 1 is to order list
        if (!insertedDayId) {
            throw new ApiError(500, `Training day has not been added`);
        };

        return ApiSuccess(res, 201, { planId, trainingDayId: insertedDayId }, 'Training day has been added');
    } catch (error) {
        next(error);
    }
}

export async function updateTrainignDay(req, res, next) {
    const day_id = Number(req.body.day_id)
    const { name, description } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['day_id', 'name']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const dayExist = await TrainingDays.checkIfDayExist(day_id);
        if (!dayExist) {
            throw new ApiError(404, `Day with id ${day_id} not found`);
        }

        const result = await TrainingDays.updateTrainingDayInTrainingPlan(day_id, name, description, 1); // 1 is to order list
        if (!result) {
            throw new ApiError(500, `Training day has not been updated`);
        };

        return ApiSuccess(res, 200, { day_id }, 'Training day has been updated');
    } catch (error) {
        next(error);
    }
}

export async function deleteTrainingDay(req, res, next) {
    const { day_id } = req.body;
    try {
        if (!day_id) {
            throw new ApiError(400, `Missing required fields: day_id`);
        };

        const dayExist = await TrainingDays.checkIfDayExist(day_id);
        if (!dayExist) {
            throw new ApiError(404, `Day with id ${day_id} not found`);
        }

        const result = await TrainingDays.deleteTrainingDayFromTrainingPlan(day_id);
        if(!result){
            throw new ApiError(500, `Day with id ${day_id} has not been deleted`);
        }

        return ApiSuccess(res, 200, day_id, 'Training day has been deleted');
    } catch (error) {
        next(error);
    }
}