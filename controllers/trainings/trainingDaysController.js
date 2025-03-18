import TrainingDays from "../../models/trainings/trainingDays.js";

export async function getAllTrainingDays(trainingPlanId){
    try {
        const result = await TrainingDays.getAllTrainingDaysInTrainingPlan(trainingPlanId);

        return {
            status: !!result,
            data: result
        }
    } catch (error) {
        console.log(`Error while getting training plan ${trainingPlanId}: `, error);
        return {
            status: false, 
            data: null,
            message: `Error while getting training plan ${trainingPlanId}`,
            errMessage: error,
        }
    }
}

export async function getTrainingDayData(trainingDayId){
    try {
        const result = await TrainingDays.getTrainingDayById(trainingDayId);

        return {
            status: !!result,
            data: result
        }
    } catch (error) {
        console.log(`Error while getting training day ${trainingDayId}: `, error);
        return {
            status: false, 
            data: null,
            message: `Error while getting training day ${trainingDayId}`,
            errMessage: error,
        }
    }
}

export async function addTrainiDayToTrainingPlan(trainingPlanId, dayName, dayDescription){
    try {
        const result = TrainingDays.addNewTrainingDayToTrainingPlan(trainingPlanId, dayName, dayDescription, 1);

        return {
            status: !!result,
            message: result 
                ? `New training day for training plan ${trainingPlanId} has been created correctly`
                : `New training day for training plan ${trainingPlanId} has not been created due some error`
        }
    } catch (error) {
        console.error(`Error while adding training day to ${trainingPlanId} training plan`);
        return {
            status: false,
            message: `Error while adding training day to ${trainingPlanId} training plan`,
            errMessage: error
        }
    }
}

export async function updateTrainignDay(day_id, new_name, new_description){
    try {
        const result = TrainingDays.updateTrainingDayInTrainingPlan(day_id, new_name, new_description, 1);

        return {
            status: !!result,
            message: result 
                ? `Training day for training plan ${day_id} has been updated correctly`
                : `Training day for training plan ${day_id} has not been updated due some error`
        }
    } catch (error) {
        console.error(`Error while updating training day for ${day_id}`);
        return {
            status: false,
            data: null,
            message: `Error while updating training day for ${day_id}`,
            errMessage: error
        }
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