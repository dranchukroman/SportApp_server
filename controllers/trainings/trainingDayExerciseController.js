import DayExercises from "../../services/trainings/dayExercises.js";
import TrainingDays from "../../services/trainings/trainingDays.js";
import { ApiError } from "../../utils/api/ApiError.js";
import { ApiSuccess } from "../../utils/api/ApiSuccess.js";
import { getMissingFields } from "../../utils/api/getMissingFields.js";

export async function getExercisesInDay(req, res, next) {
    const { day_id } = req.query;
    console.log(day_id)
    try {
        if (!day_id) {
            throw new ApiError(400, `Missing required fields: day_id`);
        };

        const dayExist = await TrainingDays.checkIfDayExist(day_id);
        if (!dayExist) {
            throw new ApiError(404, `Day with id ${day_id} not found`);
        };

        const exercises = await DayExercises.getAllExercisesInDay(day_id);

        return ApiSuccess(res, 200, { exercises }, 'Exercises for the day have been retrieved');
    } catch (error) {
        next(error);
    }
}

export async function getExerciseById(req, res, next) {
    const exerciseId = Number(req.query.exerciseId);
    try {
        if (!exerciseId) {
            throw new ApiError(400, `Missing required fields: exerciseId`);
        };

        const exercise = await DayExercises.getExerciseById(exerciseId);
        if (!exercise) {
            throw new ApiError(404, `Exercise with id ${exerciseId} does not exist`);
        };

        return ApiSuccess(res, 200, { exerciseId, exercise }, 'Exercise retrieved successfully');
    } catch (error) {
        next(error);
    }
}

export async function addExerciseToTrainingDay(req, res, next) {
    const {
        day_id,
        exercise_id,
        muscle_group,
        description,
        rest_time,
        sets,
        reps,
        weight
    } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['day_id', 'exercise_id', 'muscle_group', 'description', 'rest_time', 'sets', 'reps', 'weight']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const dayExist = await TrainingDays.checkIfDayExist(day_id);
        if (!dayExist) {
            throw new ApiError(404, `Day with id ${day_id} not found`);
        }

        const insertedExerciseId = await DayExercises.addExerciseToDay(day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight);
        if (!insertedExerciseId) {
            throw new ApiError(500, `Exercise has not been added`);
        };

        return ApiSuccess(res, 201, { exerciseId: insertedExerciseId }, 'Exercise has been added');
    } catch (error) {
        next(error);
    }
}

export async function updateExercisesInDay(req, res, next) {
    const {
        muscle_group,
        rest_time,
        sets,
        reps,
        weight,
        day_exercise_id,
        exercise_id,
        description
    } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['day_exercise_id', 'exercise_id', 'muscle_group', 'description', 'rest_time', 'sets', 'reps', 'weight']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const exerciseExist = await DayExercises.checkIfExerciseExist(day_exercise_id);
        if (!exerciseExist) {
            throw new ApiError(404, `Exercise with id ${day_exercise_id} not found`);
        }

        const result = await DayExercises.updateExerciseInDay(muscle_group, rest_time, sets, reps, weight, day_exercise_id, exercise_id, description);
        if (!result) {
            throw new ApiError(500, 'Exercise has not been updated');
        };

        return ApiSuccess(res, 200, {}, 'Exercise has been updated');
    } catch (error) {
        next(error);
    }
}

export async function deleteExercisesInDay(req, res, next) {
    const { day_exercise_id } = req.body;
    try {
        if (!day_exercise_id) {
            throw new ApiError(400, `Missing required fields: day_exercise_id`);
        };

        const exerciseExist = await DayExercises.checkIfExerciseExist(day_exercise_id);
        if (!exerciseExist) {
            throw new ApiError(404, `Day with id ${day_exercise_id} not found`);
        }

        const result = await DayExercises.deleteExerciseInDay(day_exercise_id)
        if (!result) {
            throw new ApiError(500, `Exercise with id ${day_exercise_id} has not been deleted`);
        };

        return ApiSuccess(res, 200, {}, `Exercise with id ${day_exercise_id} has been deleted`)
    } catch (error) {
        next(error);
    }
}