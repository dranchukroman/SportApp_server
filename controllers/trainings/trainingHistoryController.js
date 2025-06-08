import { time } from "console";
import TrainingHistory from "../../services/trainings/trainingHistory.js";
import { ApiError } from '../../utils/api/ApiError.js'
import { ApiSuccess } from "../../utils/api/ApiSuccess.js";
import { getMissingFields } from "../../utils/api/getMissingFields.js";
import { randomUUID } from 'crypto'; // Node.js built-in

export async function saveTrainingProgress(req, res, next) {
    try {
        const { id } = req.user;
        const { trainingPlanId, trainingDayId, progress } = req.body;
        const missingFields = getMissingFields(req.body, ['trainingPlanId', 'trainingDayId', 'progress']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        if (progress.length < 1) {
            throw new ApiError(400, `Training data can not be empty`);
        }

        const sessionId = randomUUID();
        const notInsertedRecords = [];

        for (const exercise of progress) {
            const { exerciseId, records } = exercise;
            
            if (!exerciseId || !Array.isArray(records)) {
                notInsertedRecords.push(exercise);
                continue;
            }
            for (let index = 0; index < records.length; index++) {
                const { weight, reps, note, time, date } = records[index];

                const result = await TrainingHistory.addRecordToTrainingHistory(id, trainingPlanId, trainingDayId, exerciseId, date, time, reps, weight, note, index, sessionId);

                if (!result) {
                    notInsertedRecords.push(exercise);
                }
            }
        }
        if(notInsertedRecords.length === progress.length) {
            throw new ApiError(500, `History records has not been added`);
        }

        if(notInsertedRecords > 0){
            return ApiSuccess(res, 207, notInsertedRecords, 'This history records has not been added');
        }

        return ApiSuccess(res, 200, [], 'Training progress has been saved');
    } catch (error) {
        next(error);
    }
}

export async function getAllTrainingRecords(req, res, next) {
    const { id } = req.user;
    try {
        const records = await TrainingHistory.getAllRecordsFromTrainingHistory(id);

        return ApiSuccess(res, 200, records, 'All training records has been retrieved');
    } catch (error) {
        next(error);
    }
}

export async function getHistoryRecordByExercise(req, res, next) {
    const { id } = req.user;
    try {
        const { exercise_id } = req.query;
        if (!exercise_id) {
            throw new ApiError(400, `Missing required fields: exercise_id`);
        };

        // 1. Отримуємо плаский список з сервісу (ваш код не змінюється)
        const flatHistory = await TrainingHistory.getRecordByExercise(id, exercise_id);

        // Якщо історія порожня, одразу повертаємо результат
        if (flatHistory.length === 0) {
            return ApiSuccess(res, 200, [], 'Exercise history is empty.');
        }

        // 2. Групуємо дані за допомогою `reduce`
        const groupedBySession = flatHistory.reduce((acc, set) => {
            // `acc` - це наш акумулятор, об'єкт для сесій
            // `set` - це один запис з `flatHistory` (один підхід)
            const { session_id, date, ...setData } = set;

            // Якщо ми ще не бачили цю сесію, створюємо для неї запис
            if (!acc[session_id]) {
                acc[session_id] = {
                    session_id,
                    date, // Беремо дату з першого підходу сесії
                    sets: [] // Створюємо масив для підходів
                };
            }

            // Додаємо поточний підхід (set) до масиву `sets` відповідної сесії
            // Ми можемо додати весь об'єкт `set` або тільки потрібні поля
            acc[session_id].sets.push({
                history_id: setData.history_id,
                reps_completed: setData.reps_completed,
                weight_used: setData.weight_used,
                notes: setData.notes,
                time: setData.time,
                history_index: setData.history_index
            });
            
            return acc;
        }, {});

        // 3. Перетворюємо об'єкт сесій на масив і відправляємо клієнту
        // Object.values() дасть нам масив об'єктів сесій
        const result = Object.values(groupedBySession);
        
        return ApiSuccess(res, 200, result, 'Exercise history has been retrieved');
    } catch (error) {
        next(error);
    }
}

// Not for use now
export async function addTrainingRecord(req, res, next) {
    const { id } = req.user;
    const { plan_id,
        day_id,
        exercise_id,
        date,
        completed,
        sets_completed,
        reps_completed,
        weight_used,
        notes
    } = req.body;
    try {
        const missingFields = getMissingFields(req.body, ['plan_id', 'day_id', 'exercise_id', 'date', 'completed', 'sets_completed', 'reps_completed', 'weight_used', 'notes']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const result = await TrainingHistory.addRecordToTrainingHistory(id, plan_id, day_id, exercise_id, date, completed, sets_completed, reps_completed, weight_used, notes);
        if (!result) {
            throw new ApiError(500, `Training record has not been added`);
        };

        return ApiSuccess(res, 201, {}, 'Training record has been added');
    } catch (error) {
        next(error);
    }
}

// Not for use now
export async function updateTrainingRecord(req, res, next) {
    const { history_id,
        sets_completed,
        reps_completed,
        weight_used,
        notes } = req.body;
    try {

        const missingFields = getMissingFields(req.body, ['history_id', 'sets_completed', 'reps_completed', 'weight_used', 'notes']);
        if (missingFields.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        };

        const result = await TrainingHistory.updateRecordInTrainingHistory(history_id, sets_completed, reps_completed, weight_used, notes);
        if (!result) {
            throw new ApiError(500, `Training record has not been updated`);
        };

        return ApiSuccess(res, 200, {}, 'Training record has been updated');
    } catch (error) {
        next(error);
    }
}

// Not for use now
export async function deleteTrainingRecord(req, res, next) {
    const { history_id } = req.body;
    try {
        if (!history_id) {
            throw new ApiError(400, `Missing required fields: history_id`);
        };

        const result = await TrainingHistory.deleteRecordFromTrainingHistory(history_id);
        if (!result) {
            throw new ApiError(500, `Training record has not been deleted`);
        };

        return ApiSuccess(res, 200, {}, 'Training record has been deleted');
    } catch (error) {
        next(error);
    }
}