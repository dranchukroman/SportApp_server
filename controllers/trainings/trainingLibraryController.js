import exerciseLibrary from "../../models/trainings/exerciseLibrary.js";

export async function getAllExercisesFromLibrary(muscle_group){
    try {
        const result = await exerciseLibrary.getAllExercisesFromLibrary(muscle_group)
        return {
            status: !!result,
            data: result
        }
    } catch (error) {
        console.log('Cant get all exercises from library')
        return {
            status: false,
            data: null
        }
    }
}

export async function addExerciseToLibrary(name, muscle_group, equipment, difficulty, video_url, instructions){
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

export async function updateExerciseInLibrary(exercise_id, name, muscle_group, equipment, difficulty, video_url, instructions){
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

export async function deleteExerciseFromLibrary(exercise_id){
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