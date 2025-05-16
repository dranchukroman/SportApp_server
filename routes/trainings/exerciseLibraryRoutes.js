import express from 'express'
import { authenticateToken } from '../../middleware/authenticateToken.js'; 
import { getAllExercisesFromLibrary, updateExerciseInLibrary, deleteExerciseFromLibrary, addExerciseToLibrary, getCategories } from '../../controllers/trainings/trainingLibraryController.js';

const router = express.Router();

router.get('/categories', authenticateToken, getCategories);
router.get('/getAllExercises', authenticateToken, getAllExercisesFromLibrary);
router.post('/addExerciseToLibrary', authenticateToken, addExerciseToLibrary);
router.put('/updateExerciseToLibrary', authenticateToken, updateExerciseInLibrary);
router.delete('/deleteExerciseToLibrary', authenticateToken, deleteExerciseFromLibrary);

export default router;