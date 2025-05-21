import Users from '../../services/user/users.js';
import jwt from 'jsonwebtoken';
import { generateCode, storeCode, verifyCode, deleteCode } from '../../utils/email/verificationCode.js';
import { sendEmailWithVerificationCode } from '../../utils/email/emailService.js'
import { ApiError } from "../../utils/api/ApiError.js";
import { ApiSuccess } from "../../utils/api/ApiSuccess.js";
import { getMissingFields } from "../../utils/api/getMissingFields.js";

const SECRET_KEY = process.env.SECRET_KEY;

export async function loginUser(req, res, next) {
	const { email, password } = req.body;
	try {
		const missingFields = getMissingFields(req.body, ['email', 'password']);
		if (missingFields.length > 0) {
			throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
		};

		const isEmailValid = await Users.checkUserByEmail(email);
		if (!isEmailValid) {
			throw new ApiError(404, `Account with email ${email} has not been found`);
		}

		const { isPassValid, userData } = await Users.checkUserPassword(email, password);
		if (!isPassValid) {
			throw new ApiError(401, `Invalid password`);
		};

		const token = jwt.sign(
			{ id: userData.user_id, email, role: userData.role },
			SECRET_KEY,
			{ expiresIn: '3 days' }
		);
		if (!token) {
			throw new ApiError(500, `Logginnign failed`);
		}

		return ApiSuccess(res, 200, { token }, 'User has been successfully logged in');
	} catch (error) {
		next(error);
	}
}

export async function registerNewUser(req, res, next) {
	const { email, password } = req.body;
	try {
		const missingFields = getMissingFields(req.body, ['email', 'password']);
		if (missingFields.length > 0) {
			throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
		};

		// Add validation if email code has been verified

		const isUserExist = await Users.checkUserByEmail(email);
		if (isUserExist) {
			throw new ApiError(404, `Account with email: ${email} already exist`);
		}

		const userData = await Users.addNewUser(email, password, role);
		if (!userData) {
			throw new ApiError(500, `Registration failed`);
		}

		const token = jwt.sign(
			{ id: userData.user_id, email, role: userData.role },
			SECRET_KEY,
			{ expiresIn: '3 days' }
		);

		return ApiSuccess(res, 200, { token }, 'New account has been successfully created');
	} catch (error) {
		next(error);
	}
}

export async function sendVerificationCode(req, res, next) {
	const { email } = req.body;
	try {
		if (!email) {
			throw new ApiError(400, `Missing required fields: email`);
		};

		const code = await generateCode();

		const isDelivered = await sendEmailWithVerificationCode(email, code);
		if (!isDelivered) {
			throw new ApiError(500, 'Sending verification code failed');
		}

		await storeCode(email, code); // add code to storage

		return ApiSuccess(res, 200, { isDelivered }, 'Verification code has been send');
	} catch (error) {
		next(error);
	}
}

export async function isUserExist(req, res, next) {
	const { email } = req.body;
	try {
		if (!email) {
			throw new ApiError(400, `Missing required fields: email`);
		};

		const isExist = await Users.checkUserByEmail(email);

		return ApiSuccess(res, 200, { isExist }, `User ${isExist ? '' : 'do not '}exist`)
	} catch (error) {
		next(error);
	}
}

// Verify registration code
export async function codeVerification(req, res, next) {
	const { email, verificationCode } = req.body;
	try {
		const missingFields = getMissingFields(req.body, ['email', 'verificationCode']);
		if (missingFields.length > 0) {
			throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
		};

		const isCodeValid = await verifyCode(email, verificationCode);
		if (!isCodeValid) {
			throw new ApiError(401, 'Invalid or expired code')
		};

		await deleteCode(email); // deleting code from storage

		return ApiSuccess(res, 200, { isCodeValid }, 'Email verified successfully');
	} catch (error) {
		next(error);
	}
}

// Update user password
export async function updatePassword(req, res, next) {
	const { email, newPassword } = req.body;
	try {
		const missingFields = getMissingFields(req.body, ['email', 'newPassword']);
		if (missingFields.length > 0) {
			throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
		};

		const isUserExist = await Users.checkUserByEmail(email);
		if (!isUserExist) {
			throw new ApiError(404, `Account with email ${email} do not exist`);
		};

		const isPassUpdated = await Users.updateUserPassword(email, newPassword);
		if (!isPassUpdated) {
			throw new ApiError(500, 'Updating password failed');
		};

		return ApiSuccess(res, 200, {}, 'Password has been updated successfully');
	} catch (error) {
		next(error);
	}
}

// Delete user
export async function deleteUser(req, res, next) {
	const { email } = req.user;
	try {
		const isUserExist = await Users.checkUserByEmail(email);
		if (!isUserExist) {
			throw new ApiError(404, `Account with email ${email} do not exist`);
		}

		const isUserDeleted = await Users.deleteUser(email);
		if (!isUserDeleted) {
			throw new ApiError(500, 'Updating password failed');
		}

		return ApiSuccess(res, 200, {}, 'Profile has been deleted successfully');
	} catch (error) {
		next(error);
	}
}

export async function checkToken(req, res, next) {
	try {
		const tokenStatus = req.user?.email
			? true
			: false
		return ApiSuccess(res, 200, { tokenStatus }, `Token is${!tokenStatus ? ' not' : ''} valid`);
	} catch (error) {
		next(error);
	}
}