import db from '../config/db.js';

class TrainignHistory {
  static async connect() {
    if (!db._connected) {
      await db.connect();
    }
  }

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
        console.error(`Adding training record to DB for ${user_id} failed: `, error);
        return false;
    }
  }

  static async getAllRecordsFromTrainingHistory(user_id){
    try {
        const result = await db.query(`
            SELECT * FROM training_history 
            WHERE user_id = $1 
            ORDER BY date DESC;
        `, [
            user_id
        ])

        return result.rows;
    } catch (error) {
        console.error(`Getting all training records from DB for ${user_id} failed: `, error);
        return false;
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
        console.error(`Getting exercise records for ${user_id} failed: `, error);
        return false;
    }
  }

  static async updateRecordInTrainingHistory(history_id, sets_completed, reps_completed, weight_used, notes){
    try {
        const result = await db.query(`
            UPDATE training_history 
                SET completed = $2, sets_completed = $3, reps_completed = $4, weight_used = $5, notes = $6 
                WHERE history_id = $1;
        `, [
            history_id, 
            sets_completed, 
            reps_completed, 
            weight_used, 
            notes
        ])

        return result.rowCount > 0;
    } catch (error) {
        console.error(`Updating training record with id ${history_id} in DB failed: `, error);
        return false;
    }
  }

  static async deleteRecordFromTrainingHistory(history_id){
    try {
        const result = await db.query(`
            DELETE FROM training_history WHERE history_id = $1;
        `, [
            history_id
        ])

        return result.rowCount > 0;
    } catch (error) {
        console.error(`Deleting training record with id ${history_id} from DB failed: `, error);
        return false;
    }
  }
}

export default TrainignHistory;
