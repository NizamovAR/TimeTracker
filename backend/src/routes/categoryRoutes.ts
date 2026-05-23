import { Router } from 'express'; 
import { validate } from '../lib/validate';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController';

import {
    createCategorySchema,
    updateCategorySchema
} from '../lib/Validations/category';

import { protect } from '../middleware/protect'

const router = Router();

//прописываем роуты
router.get('/', protect, getAllCategories);
router.post('/', protect, validate(createCategorySchema), createCategory);
router.put('/:id', protect, validate(updateCategorySchema), updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;