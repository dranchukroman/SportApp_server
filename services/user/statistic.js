import db from "../../config/pgConfig.js";

class Statistic {
    static async trainingTime(user_id) {
        try {
            const result = await db.query(`
                SELECT 
                    user_id,
                    SUM(EXTRACT(EPOCH FROM (max_ts - min_ts)) / 60) AS total_training_minutes
                FROM (
                    SELECT 
                        user_id,
                        session_id,
                        MIN(date + time) AS min_ts,
                        MAX(date + time) AS max_ts
                    FROM training_history
                    WHERE user_id = $1
                    GROUP BY user_id, session_id
                ) AS session_times
                GROUP BY user_id;
            `, [user_id]);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async avgPerWeek(user_id) {
        try {
            const result = await db.query(`
                WITH training_weeks AS (
                SELECT
                    user_id,
                    COUNT(DISTINCT session_id) AS total_sessions,
                    ROUND((MAX(date) - MIN(date) + 1)::numeric / 7, 2) AS weeks
                FROM training_history
                WHERE user_id = $1
                GROUP BY user_id
                )
                SELECT
                user_id,
                total_sessions,
                weeks,
                ROUND(total_sessions / weeks, 2) AS avg_sessions_per_week
                FROM training_weeks;
            `, [user_id]);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async workoutDone(user_id) {
        try {
            const result = await db.query(`
                SELECT COUNT(DISTINCT session_id) AS total_trainings
                FROM training_history
                WHERE user_id = $1;
            `, [user_id]);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async fullDbStats(user_id) {
        try {
            const result = await db.query(`
                WITH session_times AS (
                    SELECT 
                        user_id,
                        session_id,
                        MIN(date + time) AS min_ts,
                        MAX(date + time) AS max_ts
                    FROM training_history
                    WHERE user_id = $1
                    GROUP BY user_id, session_id
                ),
                date_range AS (
                    SELECT
                        user_id,
                        MIN(date) AS min_date,
                        MAX(date) AS max_date
                    FROM training_history
                    WHERE user_id = $1
                    GROUP BY user_id
                ),
                training_summary AS (
                    SELECT
                        st.user_id,
                        COUNT(DISTINCT st.session_id) AS total_sessions,
                        ROUND((dr.max_date - dr.min_date + 1)::numeric / 7, 2) AS weeks,
                        SUM(EXTRACT(EPOCH FROM (st.max_ts - st.min_ts)) / 60) AS total_training_minutes
                    FROM session_times st
                    JOIN date_range dr ON st.user_id = dr.user_id
                    GROUP BY st.user_id, dr.min_date, dr.max_date
                )
                SELECT
                    user_id,
                    total_sessions,
                    weeks,
                    ROUND(total_sessions / GREATEST(weeks, 1), 2) AS avg_sessions_per_week,
                    ROUND(total_training_minutes, 2) AS total_training_minutes
                FROM training_summary;
            `, [user_id])

            return result.rows[0];
        } catch (error) {

        }
    }
}

export default Statistic