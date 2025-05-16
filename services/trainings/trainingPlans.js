import db from '../../config/db.js';

class TrainingPlans {
    static async checkIfPlanExist(plan_id) {
        try {
            const result = await db.query(`
                SELECT 1 FROM training_plans WHERE plan_id = $1 LIMIT 1
            `, [plan_id]);

            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getCurrentTrainingPlan(user_id) {
        try {
            const result = await db.query(`
                SELECT * FROM training_plans WHERE user_id = $1 AND is_current_plan = TRUE;
            `, [
                user_id,
            ]);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getTrainingPlanById(trainingPlanId) {
        try {
            const result = await db.query(`
                SELECT * FROM training_plans WHERE plan_id = $1;
            `, [trainingPlanId]);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAllTrainingPlans(user_id) {
        try {
            const result = await db.query(`
                SELECT * FROM training_plans WHERE user_id = $1;
            `, [
                user_id,
            ]);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async addNewTrainingPlan(user_id, name, description, days_per_week, thumbnail_image, is_current_plan) {
        try {
            const result = await db.query(`
                INSERT INTO training_plans (user_id, name, description, days_per_week, thumbnail_image, is_current_plan) 
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING plan_id;
            `, [
                user_id,
                name,
                description,
                days_per_week,
                thumbnail_image,
                is_current_plan
            ]);

            return result.rows[0].plan_id;
        } catch (error) {
            throw error;
        }
    }

    static async updateTrainingPlan(plan_id, name, description, days_per_week, thumbnail_image, is_current_plan) {
        try {
            const result = await db.query(`
                UPDATE training_plans 
                    SET name = $1, description = $2, days_per_week = $3, thumbnail_image = $4, is_current_plan = $5
                WHERE plan_id = $6;
            `, [
                name,
                description,
                days_per_week,
                thumbnail_image,
                is_current_plan,
                plan_id
            ]);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteAllCurrentTrainingPlans(user_id) {
        try {
            const result = await db.query(`
                UPDATE training_plans
                    SET is_current_plan = false
                WHERE user_id = $1 AND is_current_plan = TRUE
            `, [user_id]);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteTrainingPlan(user_id, plan_id) {
        try {
            const result = await db.query(`
                DELETE FROM training_plans 
                WHERE plan_id = $1 
                AND user_id = $2
            `, [plan_id, user_id]);
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default TrainingPlans;