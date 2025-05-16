import db from '../../config/db.js'

class TrainingDays {
  static async connect() {
    if (!db._connected) {
      await db.connect();
    }
  }
  
 static async addNewTrainingDayToTrainingPlan(plan_id, name, description, order){
    try {
        const result = await db.query(`
            INSERT INTO training_days (plan_id, name, description, "order") 
                VALUES ($1, $2, $3, $4);
        `, [
            plan_id,
            name,
            description,
            order
        ]);

        return result.rowCount > 0;
    } catch (error) {
        console.log('Error while adding new trainig day into training plan: ', error);
        return false;
    }
  }

  static async getAllTrainingDaysInTrainingPlan(plan_id){ // DELETE order
    try {
        const result = await db.query(`
            SELECT * FROM training_days WHERE plan_id = $1 ORDER BY "order";
        `, [
            plan_id
        ]);

        return result.rows;
    } catch (error) {
        console.log('Error while getting all training days in training plan: ', error);
        return false;
    }
  }

  static async getTrainingDayById(day_id){
    try {
        const result = await db.query(`
            SELECT * FROM training_days WHERE day_id = $1;
        `, [
            day_id
        ]);

        return result.rows[0];
    } catch (error) {
        console.log('Error while getting all training days in training plan: ', error);
        return false;
    }
  }

  static async updateTrainingDayInTrainingPlan(day_id, name, description, order){
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
        console.log('Error while updating training day in training plan: ', error);
        return false;
    }
  }

  static async deleteTrainingDayFromTrainingPlan(day_id){
    try {
        const result = await db.query(`
            DELETE FROM training_days WHERE day_id = $1;
        `, [
            day_id
        ]);

        return true;
    } catch (error) {
        console.log('Error while : ', error);
        return false;
    }
  }
}

export default TrainingDays;
