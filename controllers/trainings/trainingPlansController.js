import TrainingPlans from '../../models/trainings/trainingPlans.js'
import Users from '../../models/user/users.js';

export async function getAllTrainingPlans(req, res){
    const { id, email } = req.user;
    try {
		if(!id || !email) return res.status(400).json({ message: 'Can not get email or id from token' });

        const trainingPlans = await TrainingPlans.getAllTrainingPlans(id);
        if(trainingPlans.length === 0) return res.status(200).json({ message: `There is no training plans for ${email}`, data: null });

        return res.status(200).json({ message: `Training plans for ${email}`, data: trainingPlans });
    } catch (error) {
        console.error(`Getting training plan for ${email} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getTrainingPlanById(req, res){
    const { trainingPlanId } = req.query;
    const { email } = req.user;
    try {
        if(!trainingPlanId) return res.status(401).json({ message: 'Training plan id is not defined'});
        const response = await TrainingPlans.getTrainingPlanById(trainingPlanId);
        if(!response) return res.status(404).json({ message: `There is no plan with id ${trainingPlanId}`, data: null});

        return res.status(200).json({ message: `Training plan with id ${trainingPlanId}`, data: response});
    } catch (error) {
        console.error(`Error while getting training plan ${email}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export async function addNewTrainingPlan(req, res){
    const { email, id } = req.user;
    try {
        const { 
            name, 
            description, 
            days_per_week, 
            thumbnail_image, 
            is_current_plan 
        } = req.body;

        if (!email || !name || !id) return res.status(400).json({ message: 'Missing required fields' });

        // If new plan is current delete other current plans
        if(is_current_plan) await TrainingPlans.deleteAllCurrentTrainingPlans(id);

        const newPlanId = await TrainingPlans.addNewTrainingPlan(id, name, description, days_per_week, thumbnail_image, is_current_plan);
        if(!newPlanId) return res.status(404).json({ message: 'Creating training plan failed'});

        return res.status(200).json({ message: 'New training plan has been created', planId: newPlanId });
    } catch (error) {
        console.error(`Adding training plan for ${email} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteTrainingPlan(req, res){
    const { email, id } = req.user
    try {
        const { trainingPlanId } = req.body;
        if (!email || !trainingPlanId) return res.status(400).json({ message: 'Missing required fields' });

        const result = await TrainingPlans.deleteTrainingPlan(id, trainingPlanId)
        if(!result) return res.status(400).json({ message: 'Training plan has not been deleted'});

        return res.status(200).json({ messaga: 'Training plan has been deleted'});
    } catch (error) {
        console.error(`Deleting training plan for ${email} failed: `, error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateTrainingPlan(req, res){
    const { email, id } = req.user;
    try {
        const { 
            trainingPlanId,
            name, 
            description, 
            days_per_week, 
            thumbnail_image, 
            is_current_plan 
        } = req.body;

        if (!email || !trainingPlanId || !name) return res.status(400).json({ message: 'Missing required fields' });

        // If new plan is current delete other current plans
        if(is_current_plan) await TrainingPlans.deleteAllCurrentTrainingPlans(userData.data.user_id);

        const result = await TrainingPlans.updateTrainingPlan(trainingPlanId, name, description, days_per_week, thumbnail_image, is_current_plan)
        if(!result) return res.status(400).json({ message: `Training plan with id ${id} has not been updated`});
        
        return res.status(200).json({ message: `Training plan with id ${id} has been updated`});
    } catch (error) {
        console.error(`Updating training plan with id ${email} failed: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}