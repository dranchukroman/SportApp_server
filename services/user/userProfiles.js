import db from '../../config/pgConfig.js';

class UserProfiles {
  static async addUserProfile(user_id, first_name, last_name, height, weight, age, gender, goal, activity_level) {
    try {
      const result = await db.query(`
        INSERT INTO user_profiles (user_id, first_name, last_name, height, weight, age, gender, goal, activity_level) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `, [
        user_id, 
        first_name, 
        last_name, 
        height, 
        weight, 
        age, 
        gender, 
        goal, 
        activity_level
      ]);
      return result.rowCount > 0; 
    } catch (error) {
      throw error;
    }
  }

  static async getUserProfileInfo(user_id) {
    try {
      const result = await db.query(`
        SELECT * FROM user_profiles WHERE user_id = $1;
      `, [user_id]);

      return result.rows[0]; 
    } catch (error) {
      throw error;
    }
  }

  static async updateUserProfile(user_id, first_name, last_name, height, weight, age, gender, goal, activity_level) {
    try {
      const result = await db.query(`
        UPDATE user_profiles 
        SET first_name = $2, last_name = $3, height = $4, weight = $5, age = $6, gender = $7, goal = $8, activity_level = $9 
        WHERE user_id = $1; 
      `, [
        user_id, 
        first_name, 
        last_name, 
        height, 
        weight, 
        age, 
        gender, 
        goal, 
        activity_level
      ]);
      return result.rowCount > 0; 
    } catch (error) {
      throw error;
    }
  }

  static async deleteUserProfile(user_id) {
    try {
      const result = await db.query(`
        DELETE FROM user_profiles WHERE user_id = $1;
      `, [user_id]);
      return result.rowCount > 0; 
    } catch (error) {
      throw error;
    }
  }
}

export default UserProfiles;
