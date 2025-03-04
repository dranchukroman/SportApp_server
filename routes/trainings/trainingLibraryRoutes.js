import express from 'express'
import { getAllExercisesFromLibrary, updateExerciseInLibrary, deleteExerciseFromLibrary, addExerciseToLibrary } from '../../controllers/trainings/trainingLibraryController.js';


const router = express.Router();

router.get('/getAllExercises', async (req, res) => {
    try {
        const { muscle_group } = req.body;

        const result = await getAllExercisesFromLibrary(muscle_group);


        if(result.status){
            console.log('Found some exercises in library');
            res.status(200).json({data: result.data});
        } else{
            console.log('Can\'t find exercises in library, try again');
            res.status(404).json({message: 'Can\'t find exercises in library, try again'});
        }
    } catch (error) {
        console.log(`Error while getting all exercises from library: `, error)
        res.status(500).json({message: 'Internal Server Error'})
    }
})

router.post('/addExerciseToLibrary', async (req, res) => {
    try {
        const { name, muscle_group, equipment, difficulty, video_url, instructions } = req.body;

        const result = await addExerciseToLibrary(name, muscle_group, equipment, difficulty, video_url, instructions);


        if(result.status){
            console.log(`Added ${name} to library`);
            res.status(200).json({message: `Added ${name} to library`});
        } else{
            console.log(`Something went wrong during adding ${name} to library`);
            res.status(404).json({message: `Something went wrong during adding ${name} to library`});
        }
    } catch (error) {
        console.log(`Error while adding exercise to library: `, error);
        res.status(500).json({message: 'Internal Server Error'})
    }
})

router.put('/updateExerciseToLibrary', async (req, res) => {
    try {
        const { exercise_id, name, muscle_group, equipment, difficulty, video_url, instructions } = req.body;

        const result = await updateExerciseInLibrary(exercise_id, name, muscle_group, equipment, difficulty, video_url, instructions);


        if(result.status){
            console.log(`Updated ${name} in library`);
            res.status(200).json({message: `Updated ${name} in library`});
        } else{
            console.log(`Something went wrong during updating ${name} to library`);
            res.status(404).json({message: `Something went wrong during updating ${name} to library`});
        }
    } catch (error) {
        console.log(`Error while updating exercise to library: `, error);
        res.status(500).json({message: 'Internal Server Error'})
    }
})

router.delete('/deleteExerciseToLibrary', async (req, res) => {
    try {
        const { exercise_id } = req.body;

        const result = await deleteExerciseFromLibrary(exercise_id);

        if(result.status){
            console.log(`Deleted exercise numbe ${exercise_id} from library`);
            res.status(200).json({message: `Deleted exercise numbe ${exercise_id} from library`});
        } else{
            console.log(`Something went wrong during deleting exercise numbe ${exercise_id} from library`);
            res.status(404).json({message: `Something went wrong during deleting exercise numbe ${exercise_id} from library`});
        }
    } catch (error) {
        console.log(`Error while deleting exercise from library: `, error);
        res.status(500).json({message: 'Internal Server Error'})
    }
})

export default router;