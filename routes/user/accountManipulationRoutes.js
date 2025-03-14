import express from 'express';
import { authenticateToken } from '../../middleware/authenticateToken.js';
import { loginUser, registerUser, updatePassword, deleteUser } from '../../controllers/user/loginController.js';

const router = express.Router();

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		const result = await loginUser(email, password);

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

router.post('/register', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const result = await registerUser(email, password);

		if (result.status) {
			res.status(201).json({ message: result.message });
		} else {
			res.status(409).json({ message: result.message });
		}
	} catch (error) {
		console.error('Error during registration:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

router.post('/forgotPassword', async (req, res) => {
	try {
		// TO DO
	} catch (error) {
		console.error('Error during registration:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

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
			message: 'This is a protected route',
			tokenStatus: true,
		});
	} else {
		res.status(403).json({
			message: 'Token is not valid',
			tokenStatus: false,
		});
	}
});

router.get('/protected', authenticateToken, (req, res) => {
	res.status(200).json({
		message: 'This is a protected route',
		user: req.user,
	});
});

export default router;
