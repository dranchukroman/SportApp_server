import express from 'express';
import { getAllTrainingPlans, addNewTrainingPlan, deleteTrainingPlan, updateTrainingPlan } from '../../controllers/trainings/trainingPlansController.js';

import { authenticateToken } from '../../middleware/authenticateToken.js'; 


const router = express.Router();

// Route to get training plans
router.get('/trainingPlans', authenticateToken, async (req, res) => {
    try {
        // Get data from query parameters
        const { email } = req.user;

        // Validate email
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Get training plans
        const trainingPlans = await getAllTrainingPlans(email);
        
        // Send status to client
        if (trainingPlans.status) {
            res.status(200).json(
                { 
                    message: trainingPlans.data.length > 0 
                        ? `Found some training plans for ${email}`
                        : `${email} hasn't created any training plan yet`,
                    data: trainingPlans.data
                }
            );
        } else {
            console.log(`Can't find any training plans for ${email}`);
            res.status(404).json(
                { 
                    message: `Can't find any training plans for ${email}`,
                    data: null
                }
            );
        }
    } catch (error) {
        console.error('Error while getting all trainings in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/addTrainingPlan', authenticateToken, async (req, res) => {
    try {
        // Get data from body
        const { email } = req.user;

        const { 
            name, 
            description, 
            days_per_week, 
            thumbnail_image, 
            is_current_plan 
        } = req.body;

        // Validate input
        if (!email || !name || !description || !days_per_week) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Add new training plan
        const addingNewPlan = await addNewTrainingPlan(
            email, 
            name, 
            description, 
            days_per_week, 
            thumbnail_image, 
            is_current_plan
        );

        // Send status to client
        if (addingNewPlan.status) {
            console.log(addingNewPlan.message);
            res.status(200).json(
                { message: addingNewPlan.message, planId: addingNewPlan.planId }
            );
        } else {
            console.log(`Can't create training plans for ${email}`);
            res.status(404).json(
                { message: addingNewPlan.message }
            );
        }
    } catch (error) {
        console.error('Error while adding new training plan: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deleteTrainingPlan', authenticateToken, async (req, res) => {
    try {
        const { email } = req.user
        const { trainingPlanId } = req.body;

        // Validate input
        if (!email || !trainingPlanId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const result = await deleteTrainingPlan(email, trainingPlanId);

        if (result.status) {
            console.log(result.message);
            res.status(200).json(
                { message: result.message }
            );
        } else {
            console.log(`Can't delete training plans for ${email}`);
            res.status(404).json(
                { message: result.message }
            );
        }
    } catch (error) {
        console.error(`Error while deleting training plan for ${email}: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/updateTrainingPlan', async (req, res) => {
    try {
        // Get data from body
        const { 
            email,
            trainingPlanId,
            name, 
            description, 
            days_per_week, 
            thumbnail_image, 
            is_current_plan 
        } = req.body;

        // Validate input
        if (!email || !trainingPlanId || !name || !description || !days_per_week) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Update training plan
        const updatingPlan = await updateTrainingPlan(
            email, 
            trainingPlanId,
            name, 
            description, 
            days_per_week, 
            thumbnail_image, 
            is_current_plan
        );

        // Send status to client
        if (updatingPlan.status) {
            console.log(updatingPlan.message);
            res.status(200).json(
                { message: updatingPlan.message }
            );
        } else {
            console.log(`Can't update training plans for ${email}`);
            res.status(404).json(
                { message: updatingPlan.message }
            );
        }
    } catch (error) {
        console.error('Error while updating new training plan: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;