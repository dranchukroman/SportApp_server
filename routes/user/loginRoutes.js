import express from 'express';
import { authenticateToken } from '../../middleware/authenticateToken.js';
import { loginUser, updatePassword, isUserExist, sendVerificationCode, deleteUser, registerNewUser, codeVerification } from '../../controllers/user/loginController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerNewUser);
router.post('/isUserExist', isUserExist);
router.post('/sendVerificationCode', sendVerificationCode);
router.post('/codeVerification', codeVerification);
router.post('/updatePassword', updatePassword);
router.delete('/delete', authenticateToken, deleteUser);

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
