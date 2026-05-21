import express from 'express';
import timeEntryController from '../controllers/timeEntryController';

const router = express.Router();

//Создаем роуты 
router.post('/', timeEntryController.createTimeEntry);
router.get('/',timeEntryController.getAllTimeEntries);

export default router;
