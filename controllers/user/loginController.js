import Users from '../../models/user/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Hashing passwords
import { generateCode, storeCode, verifyCode, deleteCode, getCodeData } from '../../utils/codeStorage.js';
import { sendCode } from '../../utils/emailService.js'

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

		const isCreated = await Users.addNewUser(email, password)
		if (!isCreated) {
			return res.status(401).json({ message: 'Creating account failed' });
		}

		return res.status(201).json({ message: 'New account created' });
	} catch (error) {
		console.error('Internal server error: ', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

export async function sendVerificationCode(req, res) {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: 'Email is require' });

		const code = generateCode();

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

		const isDelivered = await sendCode(email, mailOptions);
		if (!isDelivered) return res.status(400).json({ message: 'Can\'t send verification code!' });

		storeCode(email, code);

		return res.status(200).json({ message: 'Verification code has been send to user', isDelivered });
	} catch (error) {
		console.error('Internal server error: ', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

export async function isUserExist(req, res) {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: 'Email is require' });

		const isUserExist = await Users.checkUserByEmail(email);
		console.log(isUserExist);
		return res.status(200).json({ message: `User ${isUserExist ? '' : 'do not '} exist`, isExist: isUserExist });
	} catch (error) {
		console.error('Internal server error: ', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

// const { password } = getCodeData(email);

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

		// deleteCode(email);

		return res.status(200).json({ message: 'Email verified successfully' })
	} catch (error) {
		console.error('Internal server error: ', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

// Update user password
export async function updatePassword(req, res) {
	const { email, newPassword } = req.body;
	try {
		// Check if user exist
		const userResult = await Users.checkUserByEmail(email);
		if (!userResult) return res.status(404).json({ message: 'User do not exist' });

		// Get data and update user password
		const isUpdated = await Users.updateUserPassword(email, newPassword);
		if (!isUpdated) return res.status(401).json({ message: `Failed to update password for ${email}` });

		return res.status(200).json({ message: `Password updated successfully for user ${email}` })
	} catch (error) {
		console.error('Internal server error: ', error);
		return res.status(500).json({ message: 'Internal server error' });
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
		const isDeleted = await Users.deleteUser(email);

		if (!isDeleted) {
			return {
				status: false,
				message: 'Failed to delete user.',
				error: isDeleted.error,
			};
		}

		console.log(`User ${email} deleted successfully`);
		return {
			status: true,
			message: `User ${email} deleted successfully`,
		};
	} catch (error) {
		console.error(`Error while deleting user ${email}:`, error);
		return {
			status: false,
			message: 'Internal server error',
			error: error.message,
		};
	}
}



