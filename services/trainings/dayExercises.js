import db from '../../config/db.js'

class DayExercises {
  static async checkIfExerciseExist(day_exercise_id) {
    try {
      const result = await db.query(`
        SELECT 1 FROM day_exercises WHERE day_exercise_id = $1 LIMIT 1
      `, [day_exercise_id]);

      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getExerciseById(exerciseId) {
    try {
      const result = await db.query(`
        SELECT de.*, el.name FROM day_exercises AS de
          JOIN exercise_library AS el
          ON de.exercise_id = el.exercise_id
          WHERE day_exercise_id = $1;
      `, [exerciseId]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllExercisesInDay(day_id) {
    try {
      const result = await db.query(`
        SELECT de.*, el.name AS exercise_name
        FROM day_exercises de
          JOIN exercise_library el ON de.exercise_id = el.exercise_id
        WHERE de.day_id = $1;
      `, [day_id]);

      return result.rows
    } catch (error) {
      throw error;
    }
  }

  static async addExerciseToDay(day_id, exercise_id, muscle_group, description, rest_time, sets, reps, weight) {
    try {
      const result = await db.query(`
        INSERT INTO day_exercises (day_id, exercise_id, muscle_group, rest_time, sets, reps, weight, description) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING day_exercise_id;
      `, [
        day_id,
        exercise_id,
        muscle_group,
        rest_time,
        sets,
        reps,
        weight,
        description
      ]);

      return result.rows[0]?.day_exercise_id || null;
    } catch (error) {
      throw error;
    }
  }

  static async updateExerciseInDay(muscle_group, rest_time, sets, reps, weight, day_exercise_id, exercise_id, description) {
    try {
      const result = await db.query(`
        UPDATE day_exercises 
          SET muscle_group = $1, rest_time = $2, sets = $3, reps = $4, weight = $5, exercise_id = $6, description = $7

          WHERE day_exercise_id = $8;  
      `, [
        muscle_group,
        rest_time,
        sets,
        reps,
        weight,
        exercise_id,
        description,
        day_exercise_id
      ])
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteExerciseInDay(day_exercise_id) {
    try {
      const result = await db.query(`
        DELETE FROM day_exercises WHERE day_exercise_id = $1;
      `, [
        day_exercise_id
      ]);

      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default DayExercises;