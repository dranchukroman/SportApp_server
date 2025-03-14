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
			// Enrypting password
			const hashedPassword = await bcrypt.hash(password, 10);
			// Add user to db
			await db.query(
				`
			INSERT INTO users (email, password) 
			VALUES ($1, $2);
			`, [
				email,
				hashedPassword
			]
			);

			// Retun status
			return {
				success: true
			};
		} catch (error) {
			console.error('Error while adding new user:', error.message);
			return { success: false, error: error.message };
		}
	}

	// Check user by email
	static async checkUserByEmail(email) {
		try {
			// Send request to db
			const result = await db.query(`
				SELECT * FROM users WHERE email = $1;
				`, [
					email
				]
			);
			// Check if user exist
			if (result.rows.length === 0) {
				return { success: false, error: 'User not found' };
			}
			// Return result
			return { 
				success: true, 
				data: result.rows[0] 
			};
		} catch (error) {
			console.error('Error while getting user by email:', error.message);
			return { success: false, error: error.message };
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
	static async updateUserPassword(password, user_id) {
		try {
			// Encrypti new password
			const hashedPassword = await bcrypt.hash(password, 10);
			await db.query(`
				UPDATE users 
				SET password = $1 
				WHERE user_id = $2;
			`,  [
					hashedPassword, 
					user_id
			    ]
			);
			// Return status
			return { 
				success: true 
			};
		} catch (error) {
			console.error('Error while updating user password:', error.message);
			return { success: false, error: error.message };
		}
	}

	// Delete user
	static async deleteUser(user_id) {
		try {
			// Sent request to db to delete user
			const result = await db.query(`
				DELETE FROM users WHERE user_id = $1;
			`, [user_id]);
			// Return status
			return { 
				success: true, 
				result: result 
			};
		} catch (error) {
			console.error('Error while deleting user:', error.message);
			return { success: false, error: error.message };
		}
	}
}

export default Users;
