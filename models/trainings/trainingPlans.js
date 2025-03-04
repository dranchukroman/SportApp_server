import db from '../../config/db.js';

class TrainingPlans {
  static async connect() {
    if (!db._connected) {
      await db.connect();
    }
  }

  static async addNewTrainingPlan(user_id, name, description, days_per_week, thumbnail_image, is_current_plan){
    try {
        const resutl = await db.query(`
            INSERT INTO training_plans (user_id, name, description, days_per_week, thumbnail_image, is_current_plan) 
                VALUES ($1, $2, $3, $4, $5, $6);
        `, [
            user_id, 
            name, 
            description, 
            days_per_week, 
            thumbnail_image, 
            is_current_plan
        ]);

        return !!resutl; 
    } catch (error) {
        console.log(`Error while adding new training plan: `, error);
        return false; 
    }
  }

  static async getCurrentTrainignPlan(user_id){
    try {
        const resutl = await db.query(`
            SELECT * FROM training_plans WHERE user_id = $1 AND is_current_plan = TRUE;
        `, [
            user_id, 
        ]);

        return resutl.rows; 
    } catch (error) {
        console.log(`Error while getting current training plan: `, error);
        return false; 
    }
  }

  static async deleteAllCurrentTrainingPlans(user_id){
    try {
        const result = await db.query(`
            UPDATE training_plans
            SET is_current_plan = false
                WHERE user_id = $1 AND is_current_plan = TRUE
        `, [user_id]);
        console.log(result);
        return result.rowCount > 0;
    } catch (error) {
        console.log(`Error while changing is_current_plan to false: `, error);
        return false;  
    }
  }

  static async getAllTrainingPlans(user_id){
    try {
        const resutl = await db.query(`
            SELECT * FROM training_plans WHERE user_id = $1;
        `, [
            user_id, 
        ]);

        return resutl.rows; 
    } catch (error) {
        console.log(`Error while getitng all training plans: `, error);
        return false; 
    }
  }

  static async updateTrainingPlan(plan_id, name, description, days_per_week, thumbnail_image, is_current_plan){
    try {
        const resutl = await db.query(`
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
        console.log(resutl);
        return resutl.rowCount > 0; 
    } catch (error) {
        console.log(`Error while updating training plan: `, error);
        return false; 
    }
  }

  static async deleteTrainingPlan(user_id, plan_id){
    try {
        const resutl = await db.query(`
            DELETE FROM training_plans 
                WHERE plan_id = $1 
                AND user_id = $2
        `, [
            plan_id,
            user_id
        ]);
        return resutl.rowCount > 0; 
    } catch (error) {
        console.log(`Error while deleting training plan: `, error);
        return false; 
    }
  }
}

export default TrainingPlans;
