import exerciseLibrary from "../../services/trainings/exerciseLibrary.js";
import { ApiError } from '../../utils/api/ApiError.js'

export async function getAllExercisesFromLibrary(req, res) {
    const { id } = req.user;
    const { muscle_group } = req.query;

    try {
        if (!muscle_group) {
            throw new ApiError(400, 'Missing require fields');
        }

        const result = await exerciseLibrary.getAllExercisesFromLibrary(muscle_group)

        res.status(200).json({ data: result }); // Створити Api success;
    } catch (error) {
        next(error);
    }
}

export async function getCategories(req, res) {
    const { id } = req.user;
    try {
        //To do

        res.status(200).json({ data: '' })
    } catch (error) {
        console.log(`Error while getting categories for ${id}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function addExerciseToLibrary(name, muscle_group, equipment, difficulty, video_url, instructions) {
    try {
        const result = await exerciseLibrary.addExerciseToLibrary(name, muscle_group, equipment, difficulty, video_url, instructions);

        return {
            status: result
        }
    } catch (error) {
        console.log(`Error while adding exercise to library: `, error);
        return {
            status: false,
        }
    }
}

export async function updateExerciseInLibrary(exercise_id, name, muscle_group, equipment, difficulty, video_url, instructions) {
    try {
        const result = await exerciseLibrary.updateExerciseInLibrary(exercise_id, name, muscle_group, equipment, difficulty, video_url, instructions);

        return {
            status: result,
        }
    } catch (error) {
        console.log(`Error while updating exercise to library: `, error);
        return {
            status: false,
        }
    }
}

export async function deleteExerciseFromLibrary(exercise_id) {
    try {
        const result = await exerciseLibrary.deleteExercieFromLibrary(exercise_id);

        return {
            status: result,
        }
    } catch (error) {
        console.log(`Error while deleting exercise to library: `, error);
        return {
            status: false,
        }
    }
}