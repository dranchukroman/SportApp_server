import Users from '../../models/user/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Hashing passwords
import { generateCode, storeCode, verifyCode, deleteCode, getCodeData } from '../../utils/codeStorage.js';
import { sendCode } from '../../utils/emailService.js'

const SECRET_KEY = process.env.SECRET_KEY;

export async function loginUser(req, res) {
	try {
		const {email, password} = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Email and password are required!' });
		
		const loginResult = await Users.checkUserByEmailAndPassword(email, password);
		if (!loginResult.success) return res.status(401).json({ message: 'Invalid password' });

		const token = jwt.sign(
			{ id: loginResult.data.user_id, email },
			SECRET_KEY,
			{ expiresIn: '3 days' }
		);

		return res.status(200).json({ message: 'Email and password are correct', token: token });
	} catch (error) {
		console.error(`Login for ${email} failed: `, error.message);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

export async function registerNewUser(req, res) {
	const { email, password } = req.body;
	try {
		if (!email || !password) return res.status(400).json({ message: 'Email and password are required!' });

		const isCreated = await Users.addNewUser(email, password)
		if (!isCreated) {
			return res.status(401).json({ message: 'Creating account failed' });
		}

		return res.status(201).json({ message: 'New account created' });
	} catch (error) {
		console.error(`Register for ${email} failed: `, error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

export async function sendVerificationCode(req, res) {
	const { email } = req.body;
	try {
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
		console.error(`Sending verification code for ${email} failed: `, error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

export async function isUserExist(req, res) {
	const { email } = req.body;
	try {
		if (!email) return res.status(400).json({ message: 'Email is require' });

		const isUserExist = await Users.checkUserByEmail(email);
		console.log(isUserExist);
		return res.status(200).json({ message: `User ${isUserExist ? '' : 'do not '} exist`, isExist: isUserExist });
	} catch (error) {
		console.error(`Checking ${email} if exist failed: `, error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

// Verify registration code
export async function codeVerification(req, res) {
	const { email, verificationCode } = req.body;
	try {
		if (!email || !verificationCode) return res.status(400).json({ message: 'Email and code are require' });

		const isValid = verifyCode(email, verificationCode);
		if (!isValid) return res.status(401).json({ message: 'Invalid or expired code' });

		deleteCode(email);

		return res.status(200).json({ message: 'Email verified successfully' })
	} catch (error) {
		console.error(`Code verification for ${email} failed: `, error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

// Update user password
export async function updatePassword(req, res) {
	const { email, newPassword } = req.body;
	try {
		if(!email || !newPassword) return res.status(400).json({ message: 'Email and password are require' });

		const userResult = await Users.checkUserByEmail(email);
		if (!userResult) return res.status(404).json({ message: 'User do not exist' });

		const isUpdated = await Users.updateUserPassword(email, newPassword);
		if (!isUpdated) return res.status(401).json({ message: `Failed to update password for ${email}` });

		return res.status(200).json({ message: `Password updated successfully for user ${email}` })
	} catch (error) {
		console.error(`Updating password for ${email} failed: `, error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

// Delete user
export async function deleteUser(req, res) {
	const {email} = req.user;
	try {
		if(!email) return res.status(400).json({ message: 'Can not get email from token' });

		const isUserExist = await Users.checkUserByEmail(email);
		if (!isUserExist){
			console.error(`Can not delete profile, ${email} do not exist`);
			return res.status(400).json({ message: 'This email do not exist', status: false });
		} 

		const isDeleted = await Users.deleteUser(email);
		if (!isDeleted) {
			console.error(`Delete profile for ${email} failed`);
			return res.status(400).json({ message: 'Delete profile failed', status: false });
		}

		console.log(`Profile for ${email} has been deleted successfully`);
		return res.status(200).json({ message: 'Profile has been deleted successfully', status: false });
	} catch (error) {
		console.error(`Delete profile for ${email} failed:`, error);
		return res.status(500).json({ message: 'Internal server error', status: false });
	}
}