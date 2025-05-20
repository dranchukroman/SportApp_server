import db from '../../config/pgConfig.js';

class ExericeCategories {
  static async addNewExerciseCategory(name, description){
    try {
      const result = await db.query(`
        INSERT INTO exercise_categories (name, description) 
          VALUES ($1, $2);
      `, [
        name, 
        description
      ]);

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getAllExerciseCategories(){
    try {
      const result = await db.query(`
        SELECT * FROM exercise_categories;
      `);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateExerciseCategory(name, description, category_id){
    try {
      const result = await db.query(`
        UPDATE exercise_categories 
          SET name = $1, description = $2 
          WHERE category_id = $3;
      `, [
        name,
        description,
        category_id
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async deleteExerciseCategory(category_id){
    try {
      const result = await db.query(`
        DELETE FROM exercise_categories WHERE category_id = $1;
      `, [
        category_id
      ]);

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default ExericeCategories;