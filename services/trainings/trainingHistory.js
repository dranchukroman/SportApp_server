import db from '../config/db.js';

class TrainingHistory {
  static async addRecordToTrainingHistory(user_id, plan_id, day_id, exercise_id, date, completed, sets_completed, reps_completed, weight_used, notes){
    try {
        const result = await db.query(`
            INSERT INTO training_history (
                user_id, 
                plan_id, 
                day_id, 
                exercise_id, 
                date, 
                completed, 
                sets_completed, 
                reps_completed, 
                weight_used, 
                notes
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `, [
            user_id, 
            plan_id, 
            day_id, 
            exercise_id, 
            date, 
            completed, 
            sets_completed, 
            reps_completed, 
            weight_used, 
            notes
        ])

        return result.rowCount > 0;
    } catch (error) {
        throw error;
    }
  }

  static async getAllRecordsFromTrainingHistory(user_id){
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

  static async getRecordByExercise(user_id, exercise_id){
    try {
        const result = await db.query(`
            SELECT * FROM training_history
            WHERE user_id = $1
            AND exercise_id = $2    
        `, [ user_id, exercise_id ]);

        return result.rows;
    } catch (error) {
        throw error;
    }
  }

  static async updateRecordInTrainingHistory(history_id, sets_completed, reps_completed, weight_used, notes){
    try {
        const result = await db.query(`
            UPDATE training_history 
                SET completed = true, sets_completed = $1, reps_completed = $2, weight_used = $3, notes = $4 
                WHERE history_id = $5;
        `, [
            sets_completed, 
            reps_completed, 
            weight_used, 
            notes,
            history_id
        ])

        return result.rowCount > 0;
    } catch (error) {
        throw error;
    }
  }

  static async deleteRecordFromTrainingHistory(history_id){
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
