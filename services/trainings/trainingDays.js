import db from '../../config/db.js'

class TrainingDays {
    static async checkIfDayExist(day_id) {
        try {
            const result = await db.query(`
                SELECT 1 FROM training_days WHERE day_id = $1 LIMIT 1
                `, [day_id]);

            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getTrainingDayById(day_id) {
        try {
            const result = await db.query(`
                SELECT * FROM training_days WHERE day_id = $1;
            `, [day_id]);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAllTrainingDaysInTrainingPlan(plan_id) {
        try {
            const result = await db.query(`
                SELECT * FROM training_days WHERE plan_id = $1 ORDER BY "order";
            `, [plan_id]);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async addNewTrainingDayToTrainingPlan(plan_id, name, description, order) {
        try {
            const result = await db.query(`
                INSERT INTO training_days (plan_id, name, description, "order") 
                    VALUES ($1, $2, $3, $4)
                    RETURNING day_id;
            `, [
                plan_id,
                name,
                description,
                order
            ]);

            return result.rows[0]?.day_id || null;
        } catch (error) {
            throw error;
        }
    }

    static async updateTrainingDayInTrainingPlan(day_id, name, description, order) {
        try {
            const result = await db.query(`
                UPDATE training_days 
                    SET name = $1, description = $2, "order" = $3 
                    WHERE day_id = $4;
            `, [
                name,
                description,
                order,
                day_id
            ]);

            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteTrainingDayFromTrainingPlan(day_id) {
        try {
            const result = await db.query(`
                DELETE FROM training_days WHERE day_id = $1;
            `, [day_id]);

            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default TrainingDays;
