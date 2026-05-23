import { Request, Response } from 'express';
import prisma from '../lib/db';
import { AppError } from '../lib/errors';

//получение всех записей времени 
export const getAllTimeEntries = async (
    req: Request, 
    res: Response
) => { 
   const timeEntries = await prisma.timeEntry.findMany({
        //Возвращение записей, созданных пользователем
        where: { 
            userId: req.user!.userId 
        },
        //Подтягиваем name и color из связанной таблицы category
        include: {
            category: {
                select: {
                    id: true,
                    name: true, 
                    color: true
                },
            },
        },
        //Сначала новые записи
        orderBy: {
            startTime: 'desc'
        },
    });

   res.json({
    success:true,
    data: timeEntries,
   });
};

//Создание новой записи времени
export const createTimeEntry = async (
    req: Request, 
    res: Response
) => { 
    //Уже валидированные данные в validate.ts
    const validatedData = req.body;

    //Проверка на существование категории
    const categoryExists = await prisma.category.findFirst({
        where: {
            id: validatedData.categoryId,
            userId: req.user!.userId,
        }
    });

    if(!categoryExists) {
        throw new AppError('Такой категории не существует', 404);
    }
    
    const timeEntry = await prisma.timeEntry.create({
        data: {
            ...validatedData,
            userId: req.user!.userId
        },
        //Подтягиваем name и color из связанной таблицы category
        include: {
            category: {
                select: { 
                    name: true, 
                    color: true
                },
            },
        },
    });

    res.status(201).json({
        success: true,
        data: timeEntry,
    });
};

//Обновление записи
export const updateTimeEntry = async (
    req: Request, 
    res: Response
) => { 
    const id = req.params.id as string;
    //Уже валидированные данные в validate.ts
    const validatedData = req.body;

    const timeEntry = await prisma.timeEntry.update({
        //Только те записи, которые созданы пользователем
        where: { 
            id,
            userId: req.user!.userId 
        }, 
        data: validatedData,
        //Подтягиваем name и color из связанной таблицы category
        include: {
            category: {
                select: { 
                    name: true, 
                    color: true 
                }
            }
        },
    });

    res.json({
        success: true,
        data: timeEntry,
    });
};

//Удаление записи
export const deleteTimeEntry = async (
    req: Request, 
    res: Response
) => {
    const id = req.params.id as string;
    //Можно удалить только свои записи
    await prisma.timeEntry.delete({
        where: { 
            id,
            userId: req.user!.userId 
        },
    });

    //204 - успешное удаление c пустым ответом  
    res.status(204).send();
};


