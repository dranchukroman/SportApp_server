import db from '../../config/db.js';
import bcrypt from 'bcrypt'; // Hashing passwords

class Users {
	static async connect() {
		if (!db._connected) {
			await db.connect();
		}
	}

	// Adding new user to db
	static async addNewUser(email, password) {
		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const result = await db.query(
				`
			INSERT INTO users (email, password) 
			VALUES ($1, $2);
			`, [
				email,
				hashedPassword
			]
			);

			// Retun status
			return result.rowCount > 0;
		} catch (error) {
			console.error('Error while adding new user:', error.message);
			return false;
		}
	}

	// Check user by email
	static async checkUserByEmail(email) {
		try {
			const result = await db.query(`
				SELECT * FROM users WHERE email = $1 LIMIT 1;
				`, [email]
			);

			return result.rows.length > 0;
		} catch (error) {
			console.error('Error while checking user by email from DB:', error.message);
			return null;
		}
	}

	// Check user email and password if are valid
	static async checkUserByEmailAndPassword(email, password) {
		try {
			// Making request to db
			const result = await db.query(`
				SELECT email, password, user_id FROM users 
					WHERE email = $1;
				`, [email]
			);

			// If length is 0 it means that user have not been found
			if (result.rows.length === 0) {
				return { success: false, error: 'User not found' };
			}

			// Getting user data
			const user = result.rows[0];
			// Decrypt password and check if is same as saved
			const isMatch = await bcrypt.compare(password, user.password);

			// If pass wrong
			if (!isMatch) {
				return {
					success: false,
					error: 'Invalid password'
				};
			}
			// If pass is correct
			return {
				success: true,
				data: user
			};
		} catch (error) {
			console.error('Error while checking user credentials:', error.message);
			return { success: false, error: error.message };
		}
	}

	// Update user password
	static async updateUserPassword(email, password) {
		try {
			// Encrypti new password
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
			// Return status
			return result.rowCount > 0;
		} catch (error) {
			console.error('Error while updating user password:', error.message);
			return false;
		}
	}

	// Delete user
	static async deleteUser(email) {
		try {
			// Sent request to db to delete user
			const result = await db.query(`
				DELETE FROM users WHERE email = $1;
			`, [email]);

			// Return status
			return result.rowCount > 0;
		} catch (error) {
			console.error('Error while deleting user:', error.message);
			return false;
		}
	}
}

export default Users;
