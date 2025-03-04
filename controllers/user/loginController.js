import Users from '../../models/user/users.js';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

// Function to log in user in application
export async function loginUser(email, password) {
	try {
		// Check if user
		const loginResult = await Users.checkUserByEmailAndPassword(email, password);

		// Check status 
		if (loginResult.success) {
			// Generate JWT
			const token = jwt.sign(
				{ id: loginResult.data.user_id, email },
				SECRET_KEY,
				{ expiresIn: '1h' } // Token time life
			);

			// Return status with token
			return {
				status: true,
				message: `User ${email} logged in successfully`,
				token,
			};
		}
		// Retur fail message
		return {
			status: false,
			message: loginResult.error,
		};
  } catch (error) {
	console.error('Error during login:', error.message);
	return {
		status: false,
		message: 'Internal server error',
	};
}
}

// Function to create new account for user
export async function registerUser(email, password) {
	try {
		// Check if email already exist
		const ifExistUser = await Users.checkUserByEmail(email);

		// Send message if exist
		if (ifExistUser.success) {
			console.log('User already exists:', email);
			return {
				status: false,
				message: 'User already exists',
			};
		}

		// Adding new user 
		const registerResult = await Users.addNewUser(email, password);

		// Check if registration was successful and return message
		if (registerResult.success) {
			console.log('New user registered successfully:', email);
			return {
				status: true,
				message: 'Registration successful',
			};
		}
			return {
				status: false,
				message: registerResult.error || 'Failed to register user',
			};
	} catch (error) {
		console.error('Error during registration:', error.message);
		return {
			status: false,
			message: 'Internal server error',
		};
	}
}

// Update user password
export async function updatePassword(email, newPassword) {
	try {
		// Check if user exist
		const userResult = await Users.checkUserByEmail(email);

		// Send message if not exist
		if (!userResult.success) {
			return {
				status: false,
				message: `User with email ${email} not found.`,
			};
		}

		// Get data and update user password
		const user = userResult.data[0];
		const updateResult = await Users.updateUserPassword(newPassword, user.user_id);

		// Send result message
		if (updateResult.success) {
			console.log(`Password updated successfully for user ${email}`);
			return {
				status: true,
				message: `Password updated successfully for user ${email}`,
			};
		} else {
			console.log(`Failed to update password for ${email}`);
			return {
				status: false,
				message: `Failed to update password for ${email}`,
				error: updateResult.error,
			};
		}
	} catch (error) {
		console.error(`Error while updating password for user ${email}:`, error);
		return {
			status: false,
			message: 'Internal server error',
			error: error.message,
		};
	}
}

// Delete user
export async function deleteUser(email) {
	try {
		// Check if user exist
		const loginResult = await Users.checkUserByEmail(email);

		// If not exist sent message
		if (!loginResult.success) {
			return {
				status: false,
				message: 'Invalid email.',
			};
		}

		// Get user data and delete user
		const user = loginResult.data;
		const deleteResult = await Users.deleteUser(user.user_id);

		if (deleteResult.success) {
			console.log(`User ${email} deleted successfully`);
			return {
				status: true,
				message: `User ${email} deleted successfully`,
			};
		} else {
			return {
				status: false,
				message: 'Failed to delete user.',
				error: deleteResult.error,
			};
		}
	} catch (error) {
		console.error(`Error while deleting user ${email}:`, error);
		return {
			status: false,
			message: 'Internal server error',
			error: error.message,
		};
	}
}



