import DayExercises from "../../models/trainings/dayExercises.js";

export async function getExercisesInDay(day_id){
    try {
        const result = await DayExercises.getAllExericsesInDay(day_id);

        return {
            status: !!result,
            data: result,
        }
    } catch (error) {
        console.log(`Error while getting exercises for day: ${day_id}:`, error);
        return {
            status: false,
            data: null,
            message: `Error while getting exercises for day: ${day_i}:`,
            errMessage: error,
        }
    }
}

export async function addExerciseToTrainingDay(day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight){
    try {
        const result = await DayExercises.addExerciseToDay(day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight);

        return {
            status: !!result,
        }
    } catch (error) {
        console.log(`Error while adding exercise for day: ${day_id} :`, error);
        return {
            status: false,
            message: `Error while adding exercise for day: ${day_id} :`,
            errMessage: error,
        }
    }
}
export async function updateExercisesInDay(muscle_group, rest_time, sets, reps, weight, day_exercise_id){
    try {
        const result = await DayExercises.updateExerciseInDay(muscle_group, rest_time, sets, reps, weight, day_exercise_id);

        return {
            status: !!result
        }
    } catch (error) {
        console.log(`Error while updating exercise ${day_exercise_id}:`, error);
        return {
            status: false,
            message: `Error while updating exercise ${day_exercise_id}:`,
            errMessage: error,
        }
    }
}
export async function deleteExercisesInDay(day_exercise_id){
    try {
        const result = await DayExercises.deleteExerciseInDay(day_exercise_id)

        return {
            status: !!result
        }
    } catch (error) {
        console.log(`Error while deleting exercise ${day_exercise_id} :`, error);
        return {
            status: false,
            message: `Error while deleting exercise ${day_exercise_id} :`,
            errMessage: error,
        }
    }
}