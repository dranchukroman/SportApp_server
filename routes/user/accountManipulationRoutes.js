import express from 'express';
import {
	loginUser,
	registerUser,
	updatePassword,
	deleteUser,
} from '../../controllers/user/loginController.js';
import { authenticateToken } from '../../middleware/authenticateToken.js'; 

const router = express.Router(); // Create router

// Route for login
router.post('/login', async (req, res) => {
	try {
		// Get data from request body
		const { email, password } = req.body;

		// Get data to login user
		const result = await loginUser(email, password);

		// Send resutl to client
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

// Route to registration
router.post('/register', async (req, res) => {
	try {
		// Get data from request body
		const { email, password } = req.body;
		// Register user
		const result = await registerUser(email, password);

		// Send status to client
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

// Route to delete user
router.delete('/delete', async (req, res) => {
	try {
		// Get user data
		const user = req.body.user.data.user;
		// Delete user
		const result = await deleteUser(user.email);

		// Sent status to client
		if (result.status) {
			res.status(201).json({ message: result.message, status: result.status });
		} else {
			res.status(400).json({ message: result.message, status: result.status });
		}
	} catch (error) {
		console.error('Error during deleting user:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
	res.status(200).json({
		message: 'This is a protected route',
		user: req.user, // Information from token
	});
});

export default router;
