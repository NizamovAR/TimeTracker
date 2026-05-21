import express from 'express'; 
import categoryController from '../controllers/categoryController';

const router = express.Router();

//прописываем роуты
router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);

export default router;