import TrainingPlans from '../../models/trainings/trainingPlans.js'
import Users from '../../models/user/users.js';

export async function getAllTrainingPlans(email){
    try {
        // Check if user exist and get data
        const userData = await Users.checkUserByEmail(email);
        if(!userData.success){
            console.log(`Can't find ${email} in db`);
            return {
                status: false,
                message: `Can't find ${email} in db`
            }
        }

        // Get and check training plans
        const trainingPlans = await TrainingPlans.getAllTrainingPlans(userData.data.user_id);
        if(!trainingPlans){
            console.log(`Can't get all training plans for ${email}`);
            return {
                status: false,
                message: `Can't get all training plans for ${email}`,
            } 
        }

        // Return data
        return {
            status: !!trainingPlans,
            data: trainingPlans
        }
    } catch (error) {
        console.log('Error durign getting all training plans: ', error);
        return {
            status: false,
            message: 'Error durign getting all training plans'
        }
    }
}

export async function addNewTrainingPlan(email, name, description, days_per_week, thumbnail_image, is_current_plan){
    try {
        // Check if user exist and get data
        const userData = await Users.checkUserByEmail(email);
        if(!userData.success){
            console.log(`Can't find ${email} in db`);
            return {
                status: false,
                message: `Can't find ${email} in db`
            }
        }

        // Check if all fields exist
        if(!userData.data.user_id || 
            !name ||
            !description ||
            !days_per_week
            // !thumbnail_image ||
            // !is_current_plan
        ) {
            console.log(`Error while getting data for new training plan for ${email}`);
            return {
                status: false,
                message: `Some training plan data missed somewhere for ${email}`
            }
        }
        // If new plan is current delete other current plans
        if(is_current_plan){
            const deleteActivePlans = await TrainingPlans.deleteAllCurrentTrainingPlans(userData.data.user_id);
        }

        const result = await TrainingPlans.addNewTrainingPlan(userData.data.user_id, name, description, days_per_week, thumbnail_image, is_current_plan)

        return {
            status: result != '',
            planId: result,
            message: result != ''
                ? `Training plan for ${email} has been created`
                : `Training plan for ${email} has not been created for some reason`
        }
    } catch (error) {
        console.error('Error durign addin new training plans: ', error);
        return {
            status: false,
            message: 'Error durign getting all training plans'
        }
    }
}

export async function deleteTrainingPlan(email, trainingPlanId){
    try {
        const userData = await Users.checkUserByEmail(email);
        if(!userData.success){
            console.log(`Can't find ${email} in db`);
            return {
                status: false,
                message: `Can't find ${email} in db`
            }
        }

        const result = await TrainingPlans.deleteTrainingPlan(userData.data.user_id, trainingPlanId)
        return {
            status: !!result,
            message: !!result 
            ? `Training plan for ${email} has been deleted`
            : `Training plan for ${email} has not been deleted for some reason`
        }
    } catch (error) {
        console.error(`Error while deleting training plan for ${email}`);
        return {
            status: false, 
            message: `Error while deleting training plan for ${email}`
        }
    }
}

export async function updateTrainingPlan(email, trainingPlanId, name, description, days_per_week, thumbnail_image, is_current_plan){
    try {
        const userData = await Users.checkUserByEmail(email);
        if(!userData.success){
            console.log(`Can't find ${email} in db`);
            return {
                status: false,
                message: `Can't find ${email} in db`
            }
        }
        console.log(trainingPlanId);
        // Check if all fields exist
        if(!userData.data.user_id ||
            !trainingPlanId ||
            !name ||
            !description ||
            !days_per_week ||
            !thumbnail_image ||
            !is_current_plan
        ) {
            console.log(`Error while updatin training plan for ${email}`);
            return {
                status: false,
                message: `Some training plan data missed somewhere for ${email}`
            }
        }

        // If new plan is current delete other current plans
        if(is_current_plan){
            await TrainingPlans.deleteAllCurrentTrainingPlans(userData.data.user_id);
        }

        const result = await TrainingPlans.updateTrainingPlan(trainingPlanId, name, description, days_per_week, thumbnail_image, is_current_plan)
        return {
            status: !!result,
            message: !!result 
                ? `Training plan for ${email} has been updated`
                : `Training plan for ${email} has not been updated for some reason`
        }
    } catch (error) {
        console.error(`Error while deleting training plan for ${email}`);
        return {
            status: false, 
            message: `Error while updating training plan for ${email}`
        }
    }
}