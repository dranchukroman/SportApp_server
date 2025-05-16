import db from '../../config/db.js';
import bcrypt from 'bcrypt';

class Users {
	static async addNewUser(email, password) {
		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const result = await db.query(`
				INSERT INTO users (email, password) 
				VALUES ($1, $2)
				RETURNING user_id;
			`, [email, hashedPassword]
			);

			return result.rows[0].user_id;
		} catch (error) {
			throw error;
		}
	}

	static async checkUserByEmail(email) {
		try {
			const result = await db.query(`
				SELECT * FROM users WHERE email = $1 LIMIT 1;
				`, [email]
			);

			return result.rows.length > 0;
		} catch (error) {
			throw error;
		}
	}

	static async checkUserPassword(email, password) {
		try {
			const userData = await db.query(`
				SELECT * FROM users 
					WHERE email = $1
				LIMIT 1;
			`, [email]);

			const isPassMatch = await bcrypt.compare(password, userData.rows[0].password);
			return {
				isPassValid: isPassMatch,
				userData: isPassMatch ? userData.rows[0] : {}
			}
		} catch (error) {
			throw error;
		}
	}

	static async updateUserPassword(email, password) {
		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const result = await db.query(`
				UPDATE users 
				SET password = $1 
				WHERE email = $2;
			`,  [
					hashedPassword, 
					email
			    ]
			);
			return result.rowCount > 0;
		} catch (error) {
			throw error;
		}
	}

	static async deleteUser(email) {
		try {
			const result = await db.query(`
				DELETE FROM users WHERE email = $1;
			`, [email]);

			return result.rowCount > 0;
		} catch (error) {
			throw error;
		}
	}
}

export default Users;
