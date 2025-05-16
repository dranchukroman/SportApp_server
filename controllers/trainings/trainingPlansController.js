import TrainingPlans from '../../services/trainings/trainingPlans.js'
import { ApiError } from "../../utils/api/ApiError.js";
import { ApiSuccess } from "../../utils/api/ApiSuccess.js";
import { getMissingFields } from "../../utils/api/getMissingFields.js";

export async function getAllTrainingPlans(req, res, next) {
    const { id } = req.user;
    try {
        const trainingPlans = await TrainingPlans.getAllTrainingPlans(id);

        return ApiSuccess(res, 200, { trainingPlans }, 'Training plans data has been retrieved');
    } catch (error) {
        next(error);
    }
}

export async function getTrainingPlanById(req, res, next) {
    const { trainingPlanId } = req.query;
    try {
        if (!trainingPlanId) {
            throw new ApiError(400, `Missing required fields: trainingPlanId`);
        };

        const planExist = await TrainingPlans.checkIfPlanExist(trainingPlanId);
        if (!planExist) {
            throw new ApiError(404, `Training plan with id ${trainingPlanId} not found`);
        }

        const trainingPlan = await TrainingPlans.getTrainingPlanById(trainingPlanId);
        if (!trainingPlan) {
            throw new ApiError(404, `Training plan with id ${trainingPlanId} does not exist`);
        };

        return ApiSuccess(res, 200, { trainingPlan }, 'Training plan data has been retrieved');
    } catch (error) {
        next(error);
    }
};

export async function addNewTrainingPlan(req, res, next) {
    const { id } = req.user;
    const {
        name,
        description,
        days_per_week,
        thumbnail_image,
        is_current_plan
    } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['name', 'description', 'days_per_week', 'thumbnail_image', 'is_current_plan']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        // If new plan is current delete other current plans
        if (is_current_plan) await TrainingPlans.deleteAllCurrentTrainingPlans(id);

        const newPlanId = await TrainingPlans.addNewTrainingPlan(id, name, description, days_per_week, thumbnail_image, is_current_plan);
        if (!newPlanId) {
            throw new ApiError(500, `Exercise has not been added`);
        };

        return ApiSuccess(res, 201, { planId: newPlanId }, 'Training plan has been created');
    } catch (error) {
        next(error);
    }
}

export async function deleteTrainingPlan(req, res, next) {
    const { id } = req.user
    const { trainingPlanId } = req.body;
    try {
        if (!trainingPlanId) {
            throw new ApiError(400, `Missing required fields: trainingPlanId`);
        };

        const planExist = await TrainingPlans.checkIfPlanExist(trainingPlanId);
        if (!planExist) {
            throw new ApiError(404, `Training plan with id ${day_id} not found`);
        }

        const result = await TrainingPlans.deleteTrainingPlan(id, trainingPlanId);
        if (!result) {
            throw new ApiError(500, `Training plan with id ${trainingPlanId} has not been deleted`);
        };

        return ApiSuccess(res, 200, {}, 'Training plan has been deleted');
    } catch (error) {
        next(error);
    }
}

export async function updateTrainingPlan(req, res, next) {
    const { id } = req.user;
    const {
        trainingPlanId,
        name,
        description,
        days_per_week,
        thumbnail_image,
        is_current_plan
    } = req.body;
    try {        
        const missingFields = getMissingFields(req.body, ['trainingPlanId', 'name', 'description', 'days_per_week', 'thumbnail_image', 'is_current_plan']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const planExist = await TrainingPlans.checkIfPlanExist(trainingPlanId);
        if (!planExist) {
            throw new ApiError(404, `Training plan with id ${day_id} not found`);
        }

        // If new plan is current delete other current plans
        if (is_current_plan) await TrainingPlans.deleteAllCurrentTrainingPlans(id);

        const result = await TrainingPlans.updateTrainingPlan(trainingPlanId, name, description, days_per_week, thumbnail_image, is_current_plan)
        if (!result) {
            throw new ApiError(500, 'Training plan has not been updated');
        };

        return ApiSuccess(res, 200, {}, 'Training plan has been updated');
    } catch (error) {
        next(error);
    }
}