import { Request, Response } from 'express';
import prisma from '../lib/db';


//Получить все категории
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        //Получаем все категории, отсортированные по времени добавления
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' }
        });
        //отправляем объект categories
        res.json(categories)
    }
    //обработка ошибок
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Что-то пошло не так при получении категории'});
    }
};

//Создать новую категорию
export const createCategory = async (req: Request, res: Response) => {
    try {
        //берем данные из фронтенда
        const {name, color } = req.body; 

        //Проверяем пришло ли имя
        if(!name) {
            res.status(400).json({error: 'Имя категории обязательно' });
            return;
        }
        //создание новой категории
        const newCategory = await prisma.category.create({
            data: {
                name: name.trim(),
                color: color || '#3b82f6'
            }
        });
        //отправляем объект newCategory
        res.status(201).json(newCategory);
    }
    //обработка ошибок
    catch (error) { 
        console.error(error)
        res.status(500).json({error: 'Ошибка при создании категории'});
    }
};

export default { 
    getAllCategories, 
    createCategory
};