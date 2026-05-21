import { Request, Response } from 'express';
import prisma from '../lib/db';
import { AppError } from '../lib/errors';
import { success } from 'zod';
import { time } from 'node:console';


//получение всех записей времени
export const getAllTimeEntries = async (req: Request, res: Response) => { 
   const timeEntries = await prisma.timeEntry.findMany({
    include: {
        category: {
            select: {name: true, color: true}
        }
    },
    orderBy: {startTime: 'desc'},
   });

   res.json({
    success:true,
    data: timeEntries,
   });
};

//Создание новой записи времени
export const createTimeEntry = async (req: Request, res: Response) => { 
    const validatedData = req.body;

    const timeEntry = await prisma.timeEntry.create({
        data: validatedData,
        include: {
            category: {
                select: { name: true, color: true}
            }
        },
    });

    res.status(201).json({
        success: true,
        data: timeEntry,
    });
};

//Обновление записи
export const updateTimeEntry = async (req: Request, res: Response) => { 
    const id = req.params.id as string;
    const validatedData = req.body;

    const timeEntry = await prisma.timeEntry.update({
        where: { id }, 
        data: validatedData,
        include: {
            category: {
                select: { name: true, color: true }
            }
        },
    });

    res.json({
        success: true,
        data: timeEntry,
    });
};

//Удаление записи
export const deleteTimeEntry = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.timeEntry.delete({
        where: { id },
    });

    res.status(204).send();
};


