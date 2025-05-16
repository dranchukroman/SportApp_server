import db from '../../config/db.js';

class exerciseLibrary {
  static async connect() {
    if (!db._connected) {
      await db.connect();
    }
  }
  static async addExerciseToLibrary(name, muscle_group, equipment, difficulty, video_url, instructions){
    try {
      const result = await db.query(`
        INSERT INTO exercise_library (name, muscle_group, equipment, difficulty, video_url, instructions) 
          VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        name, 
        muscle_group, 
        equipment, 
        difficulty, 
        video_url, 
        instructions
      ]);

      return result.rowCount > 0;
    } catch (error) {
      console.log('Error while adding exercise to library: ', error);
      return false
    }
  }
  static async getAllExercisesFromLibrary(muscle_group){
    try {
      const result = await db.query(`
        SELECT * FROM exercise_library 
          WHERE muscle_group = $1;
      `, [muscle_group]);

      return result.rows;
    } catch (error) {
      throw error('Error while getting all exercises from library: ', error);
    }
  }
  static async updateExerciseInLibrary(exercise_id, name, muscle_group, equipment, difficulty, video_url, instructions){
    try {
      const result = await db.query(`
        UPDATE exercise_library 
          SET name = $1, muscle_group = $2, 
              equipment = $3, 
              difficulty = $4, 
              video_url = $5, 
              instructions = $6 
          WHERE exercise_id = $7;
      `, [
        name, 
        muscle_group, 
        equipment, 
        difficulty, 
        video_url,
        instructions,
        exercise_id
      ]);

      return result.rowCount > 0;
    } catch (error) {
      console.log('Error while updating exercise in library: ', error);
      return false
    }
  }
  static async deleteExercieFromLibrary(exercise_id){
    try {
      const result = await db.query(`
        DELETE FROM exercise_library WHERE exercise_id = $1;
      `, [
        exercise_id
      ]);

      return result.rowCount > 0;;
    } catch (error) {
      console.log('Error while deleting exercise from library: ', error);
      return false
    }
  }
}
export default exerciseLibrary;
