import { Request, Response } from 'express';
import prisma from '../lib/db';

//Получить все категории api/categories
export const getAllCategories = async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
        where: { userId: req.user!.userId },
        orderBy: { name: 'asc' },
    });

    res.json({
        success: true,
        data: categories
    });
};

//Создать новую категорию api/categories
export const createCategory = async (req: Request, res: Response) => {
    const validatedData = req.body;

    const category = await prisma.category.create({
        data: {
            ...validatedData,
            userId: req.user!.userId,
        },
    });

    res.status(201).json({
        success: true,
        data: category,
    });
};

//Обновление категории api/categories/:id
export const updateCategory = async (req: Request, res: Response) => {
    const id  = req.params.id as string;
    const validatedData = req.body;

    const category = await prisma.category.update({
        where: { 
            id,
            userId: req.user!.userId 
        }, 
        data: validatedData,
    }); 

    res.json({
        success: true,
        data: validatedData,
    })
}

//Удаление категории /api/categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
    const id  = req.params.id as string

    await prisma.category.delete({ 
        where: { 
            id, 
            userId: req.user!.userId
        }
    });

    res.status(204).send();
};
