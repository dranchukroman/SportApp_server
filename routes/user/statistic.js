import express from 'express'
import { authenticateToken } from '../../middleware/authenticateToken.js'
import { avgTrainingsPerWeek, workoutCompleted, fullExercisingTime, fullDashboardStatistic } from '../../controllers/user/statisticController.js'

const router = express.Router()

router.get('/statFullExercisingTime', authenticateToken, fullExercisingTime)
router.get('/statAvgTrainingsPerWeek', authenticateToken, avgTrainingsPerWeek)
router.get('/statWorkoutsCompleted', authenticateToken, workoutCompleted)
router.get('/statFullDbData', authenticateToken, fullDashboardStatistic)

export default router;