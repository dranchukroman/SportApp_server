import db from '../config/db.js';

class UserProfiles {
  static async connect() {
    if (!db._connected) {
      await db.connect();
    }
  }

  static async addUserProfile(user_id, first_name, last_name, height, weight, age, gender, goal, activity_level){
    try {
        const resutl = await db.query(`
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

        return true; 
    } catch (error) {
        console.log(`Error while adding new user profile: `, error);
        return false; 
    }
  }

  static async getUserProfileInfo(user_id){
    try {
        const resutl = await db.query(`
            SELECT * FROM user_profiles WHERE user_id = $1;
        `, [
            user_id
        ]);

        return resutl.rows; 
    } catch (error) {
        console.log(`Error while getting user profile info: `, error);
        return false; 
    }
  }

  static async updateUserProfile(profile_id, first_name, last_name, height, weight, age, gender, goal, activity_level){
    try {
        const resutl = await db.query(`
           UPDATE user_profiles 
            SET first_name = $2, last_name = $3, height = $4, weight = $5, age = $6, gender = $7, goal = $8, activity_level = $9 
            WHERE profile_id = $1; 
        `, [
            profile_id, 
            first_name, 
            last_name, 
            height, 
            weight, 
            age, 
            gender, 
            goal, 
            activity_level
        ]);

        return true; 
    } catch (error) {
        console.log(`Error while updating user profile: `, error);
        return false; 
    }
  }

  static async deleteUserProfile(profile_id){
    try {
        const resutl = await db.query(`
            DELETE FROM user_profiles WHERE profile_id = $1;
        `, [
            profile_id
        ]);

        return true; 
    } catch (error) {
        console.log(`Error while deleting user profile: `, error);
        return false; 
    }
  }
}

export default UserProfiles;
