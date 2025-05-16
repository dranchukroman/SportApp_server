import db from '../config/db.js';

class ExericeCategories {
  static async connect() {
    if (!db._connected) {
      await db.connect();
    }
  }

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
      console.log(`Error while adding new exercise category: `, error);
      return false;
    }
  }

  static async getAllExerciseCategories(){
    try {
      const result = await db.query(`
        SELECT * FROM exercise_categories;
      `);

      return result.rows;
    } catch (error) {
      console.log(`Error while getting all exercise categories: `, error);
      return false;
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
      console.log(`Error while updating exercise category: `, error);
      return false;
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
      console.log(`Error while deleting exercise category`, error);
      return false;
    }
  }
}

export default ExericeCategories;