import express from 'express';
import { authenticateToken } from '../../middleware/authenticateToken.js';
import { loginUser, updatePassword, isUserExist, sendVerificationCode, deleteUser, registerNewUser, codeVerification } from '../../controllers/user/loginController.js';

const router = express.Router();

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		const result = await loginUser(email, password);
		console.log(result)

		if (result.status) {
			res.status(200).json({ message: result.message, token: result.token });
		} else {
			res.status(401).json({ message: result.message });
		}
	} catch (error) {
		console.error('Error while logging in:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

router.post('/register', registerNewUser);
router.post('/isUserExist', isUserExist);
router.post('/sendVerificationCode', sendVerificationCode);
router.post('/codeVerification', codeVerification);

router.post('/updatePassword', updatePassword);

router.delete('/delete', authenticateToken, async (req, res) => {
	try {
		const email = req.user.email;

		const result = await deleteUser(email);

		if (result.status) {
			res.status(200).json({ message: result.message, status: result.status });
		} else {
			res.status(400).json({ message: result.message, status: result.status });
		}
	} catch (error) {
		console.error('Error during deleting user:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

router.get('/checkToken', authenticateToken, (req, res) => {
	if(req.user?.email){
		res.status(200).json({
			message: 'Token is valid',
			tokenStatus: true,
		});
	} else {
		res.status(403).json({
			message: 'Token is not valid',
			tokenStatus: false,
		});
	}
});

export default router;
