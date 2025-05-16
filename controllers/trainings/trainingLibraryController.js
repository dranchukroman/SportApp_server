import ExerciseLibrary from "../../services/trainings/exerciseLibrary.js";
import { ApiError } from '../../utils/api/ApiError.js'
import { ApiSuccess } from "../../utils/api/ApiSuccess.js";
import { getMissingFields } from "../../utils/api/getMissingFields.js";

export async function getAllExercisesFromLibrary(req, res, next) {
    const { muscle_group } = req.query;
    try {
        if (!muscle_group) {
            throw new ApiError(400, `Missing required fields: muscle_group`);
        };

        const exerciseList = await ExerciseLibrary.getAllExercisesFromLibrary(muscle_group)
        if (exerciseList.length === 0) {
            throw new ApiError(404, 'Requested exercise group does not exist');
        }

        return ApiSuccess(res, 200, { exerciseList }, 'Exercise list has been retrieved');
    } catch (error) {
        next(error);
    }
}

export async function getCategories(req, res, next) {
    try {
        //Create table for categories
        const muscleGroupsList = [
            { id: 1, name: 'Chest', description: null, image: null },
            { id: 2, name: 'Back', description: null, image: null },
            { id: 3, name: 'Legs', description: null, image: null },
            { id: 4, name: 'Shoulders', description: null, image: null },
            { id: 5, name: 'Arms', description: null, image: null },
            { id: 6, name: 'Core', description: null, image: null },
        ];
        if (muscleGroupsList.length === 0) {
            throw new ApiError(500, 'Require muscle group do not exist');
        }

        return ApiSuccess(res, 200, { muscleGroupsList }, 'Muscle group has been retrieved');
    } catch (error) {
        next(error);
    }
}

export async function addExerciseToLibrary(req, res, next) {
    const {
        name,
        muscle_group,
        equipment,
        difficulty,
        video_url,
        instructions
    } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['name', 'muscle_group', 'equipment', 'difficulty', 'video_url', 'instructions']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const result = await ExerciseLibrary.addExerciseToLibrary(name, muscle_group, equipment, difficulty, video_url, instructions);
        if (!result) {
            throw new ApiError(500, 'Exercise in library has not been added');
        }

        return ApiSuccess(res, 201, {}, 'Exercise has been added to library');
    } catch (error) {
        next(error);
    }
}

export async function updateExerciseInLibrary(req, res, next) {
    const {
        exercise_id,
        name,
        muscle_group,
        equipment,
        difficulty,
        video_url,
        instructions
    } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['exercise_id', 'name', 'muscle_group', 'equipment', 'difficulty', 'video_url', 'instructions']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const result = await ExerciseLibrary.updateExerciseInLibrary(exercise_id, name, muscle_group, equipment, difficulty, video_url, instructions);
        if (!result) {
            throw new ApiError(500, 'Exercise in library has not been updated');
        }

        return ApiSuccess(res, 200, {}, 'Exercise has been updated to library')
    } catch (error) {
        next(error);
    }
}

export async function deleteExerciseFromLibrary(req, res, next) {
    const { exercise_id } = req.body;
    try {
        if (!exercise_id) {
            throw new ApiError(400, `Missing required fields: exercise_id`);
        };

        const result = await ExerciseLibrary.deleteExerciseFromLibrary(exercise_id);
        if (!result) {
            throw new ApiError(500, 'Exercise in library has not been deleted');
        }

        return ApiSuccess(res, 200, {}, 'Exercise has been deleted to library')
    } catch (error) {
        next(error);
    }
}