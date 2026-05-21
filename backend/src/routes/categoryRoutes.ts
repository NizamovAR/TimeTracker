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

const router = Router();

//прописываем роуты
router.get('/', getAllCategories);
router.post('/', validate(createCategorySchema), createCategory);
router.put('/:id', validate(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;