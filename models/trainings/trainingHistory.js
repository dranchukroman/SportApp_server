import db from '../config/db.js';

class TrainignHistory {
  static async connect() {
    if (!db._connected) {
      await db.connect();
    }
  }

  static  async addRecordToTrainingHistory(user_id, plan_id, day_id, exercise_id, date, completed, sets_completed, reps_completed, weight_used, notes){
    try {
        const result = await db.query(`
            INSERT INTO training_history (user_id, plan_id, day_id, exercise_id, date, completed, sets_completed, reps_completed, weight_used, notes) 
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

        return true;
    } catch (error) {
        console.log('Error while adding record to training history: ', error);
        return false;
    }
  }

  static  async getAllRecordsFromTrainingHistory(user_id){
    try {
        const result = await db.query(`
            SELECT * FROM training_history WHERE user_id = ? ORDER BY date DESC;
        `, [
            user_id
        ])

        return result.rows;
    } catch (error) {
        console.log('Error while getting all records from training history: ', error);
        return false;
    }
  }

  static  async updateRecordInTrainingHistory(history_id, sets_completed, reps_completed, weight_used, notes){
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

        return true;
    } catch (error) {
        console.log('Error while updating record in training history: ', error);
        return false;
    }
  }

  static  async deleteRecordFromTrainingHistory(history_id){
    try {
        const result = await db.query(`
            DELETE FROM training_history WHERE history_id = $1;
        `, [
            history_id
        ])

        return true;
    } catch (error) {
        console.log('Error while deleting record from training history: ', error);
        return false;
    }
  }
}

export default TrainignHistory;
