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

const router = Router();

//Создаем роуты
router.get('/', getAllTimeEntries); 
router.post('/', validate(createTimeEntrySchema), createTimeEntry);
router.put('/:id', validate(updateTimeEntrySchema), updateTimeEntry);
router.delete('/:id', deleteTimeEntry);

export default router;
