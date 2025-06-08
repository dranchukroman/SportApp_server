import db from '../../config/pgConfig.js';

class TrainingHistory {
    static async addRecordToTrainingHistory(user_id, plan_id, day_id, day_exercise_id, date, time, reps_completed, weight_used, notes, index, session_id) {
        try {
            const result = await db.query(`
                    INSERT INTO training_history (
                        user_id,
                        plan_id,
                        day_id,
                        day_exercise_id,
                        date,
                        time,                                
                        reps_completed,                        
                        weight_used,                           
                        notes,
                        history_index,
                        session_id
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `,
                [user_id, plan_id, day_id, day_exercise_id, date, time, reps_completed, weight_used, notes, index, session_id]
            );
            
            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAllRecordsFromTrainingHistory(user_id) {
        try {
            const result = await db.query(`
            SELECT * FROM training_history 
            WHERE user_id = $1 
            ORDER BY date DESC;
        `, [user_id])

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getRecordByExercise(user_id, exercise_id) {
        try {
            const result = await db.query(`
            SELECT * FROM training_history
            WHERE user_id = $1
            AND day_exercise_id = $2
            ORDER BY date DESC, history_index;
        `, [user_id, exercise_id]);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async deleteRecordFromTrainingHistory(history_id) {
        try {
            const result = await db.query(`
            DELETE FROM training_history WHERE history_id = $1;
        `, [history_id]);

            return result.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default TrainingHistory;
