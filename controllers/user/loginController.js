import Users from '../../models/user/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Hashing passwords
import { generateCode, storeCode, verifyCode, deleteCode, getCodeData } from '../../utils/codeStorage.js';
import { sendVerificationCode } from '../../utils/emailService.js'

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
				{ expiresIn: '3 days' } // Token time life
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

export async function registerNewUser(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required!' });
		}

		const isUserExist = await Users.checkUserByEmail(email);
		if (isUserExist) {
			return res.status(400).json({ message: 'User with this email already exist!' });
		}

		const code = generateCode();
		const hashedPassword = await bcrypt.hash(password, 10);

		const mailOptions = {
			from: `"Sport App" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: 'Your Verification Code',
			text: `Your verification code is: ${code}`,
			html: `
			  <div style="font-family: sans-serif;">
				<h2>Email Verification</h2>
				<p>Your verification code is:</p>
				<h3 style="color: #007bff;">${code}</h3>
				<p>This code will expire in 10 minutes.</p>
			  </div>
			`,
		};

		const isDelivered = await sendVerificationCode(email, mailOptions);
		if (!isDelivered) {
			return res.status(400).json({ message: 'Can\'t send verification code!' });
		}

		storeCode(email, hashedPassword, code);

		return res.status(200).json({ message: 'Verification code has been send to user' });
	} catch (error) {
		console.error('Internal server error: ', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

// Verify registration code
export async function codeVerification(req, res) {
	try {
		const { email, verificationCode } = req.body;

		if (!email || !verificationCode) {
			return res.status(400).json({ message: 'Email and code are require' });
		}

		const isValid = verifyCode(email, verificationCode);

		if (!isValid) {
			return res.status(401).json({ message: 'Invalid or expired code' });
		}
		const { password } = getCodeData(email);

		const isCreated = await Users.addNewUser(email, password)

		if (!isCreated) {
			return res.status(401).json({ message: 'Creating account failed' });
		}

		deleteCode(email);

		return res.status(201).json({ message: 'Email verified successfully' })
	} catch (error) {
		console.error('Internal server error: ', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

// Update user password
export async function updatePassword(email, newPassword) {
	try {
		// Check if user exist
		const userResult = await Users.checkUserByEmail(email);

		// Send message if not exist
		if (!userResult) {
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
		const isUserExist = await Users.checkUserByEmail(email);

		// If not exist sent message
		if (!isUserExist) {
			return {
				status: false,
				message: 'Invalid email.',
			};
		}

		// Get user data and delete user
		const deleteResult = await Users.deleteUser(isUserExist.user_id);

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



