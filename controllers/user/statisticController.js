import Statistic from '../../services/user/statistic.js'
import { ApiError } from '../../utils/api/ApiError.js';
import { ApiSuccess } from '../../utils/api/ApiSuccess.js';

export async function fullExercisingTime(req, res, next) {
    const { id } = req.user;
    try {
        const result = await Statistic.trainingTime(id);

        return ApiSuccess(res, 200, result, 'Exercising time has been retrived');
    } catch (error) {
        next(error);
    }
}

export async function avgTrainingsPerWeek(req, res, next) {
    const { id } = req.user;
    try {
        const result = await Statistic.avgPerWeek(id);

        return ApiSuccess(res, 200, { avg_sessions_per_week: result?.avg_sessions_per_week }, 'Exercising time has been retrived');
    } catch (error) {
        next(error);
    }
}

export async function workoutCompleted(req, res, next) {
    const { id } = req.user;
    try {
        const result = await Statistic.workoutDone(id)

        return ApiSuccess(res, 200, result, 'Exercising time has been retrived');
    } catch (error) {
        next(error);
    }
}

export async function fullDashboardStatistic(req, res, next) {
    const { id } = req.user;
    try {
        const stats = await Statistic.fullDbStats(id);

        const data = {
            total_sessions: Number(stats.total_sessions),
            avg_sessions_per_week: Math.round(stats.avg_sessions_per_week),
            total_training_minutes: Math.round(stats.total_training_minutes),
        };

        return ApiSuccess(res, 200, data, 'Exercising time has been retrieved');
    } catch (error) {
        next(error);
    }
}