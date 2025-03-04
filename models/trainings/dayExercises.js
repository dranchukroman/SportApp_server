import db from '../../config/db.js'

class DayExercises{
static async connect(){
    if(!db._connect){
      await db.connect();
    }
  }

  static async addExerciseToDay(day_id, exercise_id, muscle_group, rest_time, sets, reps, weight){
    try {
      const result = await db.query(`
        INSERT INTO day_exercises (day_id, exercise_id, muscle_group, rest_time, sets, reps, weight) 
          VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [
        day_id,
        exercise_id, 
        muscle_group, 
        rest_time, 
        sets, 
        reps, 
        weight
      ]);

      return result.rowCount > 0;
    } catch (error) {
      console.log(`Error while adding exercise day for: `, error);
      return false;
    }
  }

  static async getAllExericsesInDay(day_id){
    try {
      const result = await db.query(`
        SELECT * FROM day_exercises WHERE day_id = $1;  
      `, [day_id]);

      return result.rows
    } catch (error) {
      console.log(`Error while getting all exercises for training plan: `, error);
      return false;
    }
  }

  static async updateExerciseInDay(muscle_group, rest_time, sets, reps, weight, day_exercise_id){
    try {
      const result = await db.query(`
        UPDATE day_exercises 
          SET muscle_group = $1, rest_time = $2, sets = $3, reps = $4, weight = $5 

          WHERE day_exercise_id = $6;  
      `, [
        muscle_group,
        rest_time,
        sets,
        reps,
        weight,
        day_exercise_id
      ])
      return result.rowCount > 0;
    } catch (error) {
      console.log('Error while updating exercise in training day: ', error);
      return false;
    }
  }

  static async deleteExerciseInDay(day_exercise_id){
    try {
      const result = await db.query(`
        DELETE FROM day_exercises WHERE day_exercise_id = $1;
      `, [
        day_exercise_id
      ]);
      
      return result.rowCount > 0;
    } catch (error) {
      console.log('Error while deleting day in training plan: ', error);
    }
  }
}

export default DayExercises;