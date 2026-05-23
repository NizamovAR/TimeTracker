import { Router } from 'express';
import { validate } from '../lib/validate';
import {
    getAllTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
} from '../controllers/timeEntryController';

import {
    createTimeEntrySchema,
    updateTimeEntrySchema,
} from '../lib/Validations/timeEntry';

import { protect } from '../middleware/protect';

const router = Router();

//Получение всех записей
router.get('/', protect, getAllTimeEntries);
//Создание новой записи
router.post('/', 
    protect, 
    validate(createTimeEntrySchema), 
    createTimeEntry
);
//Обновление записи 
router.put('/:id', 
    protect, 
    validate(updateTimeEntrySchema), 
    updateTimeEntry
);
//Удаление записи 
router.delete('/:id', protect, deleteTimeEntry);

export default router;
