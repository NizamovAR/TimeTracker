import { Request, Response } from 'express';
import prisma from '../lib/db';


//Создание новой записи времени
export const createTimeEntry = async (req: Request, res: Response) => { 
    try { 
        const { startTime, endTime, descriptrion, categoryId } = req.body;
    
        //если начальное время или категория отсутствуют
        if(!startTime || !categoryId) {
            res.status(400).json({
                success: false,
                error: 'Поля startTime и categoryId являются обязательными'
            });
            return;
        }

        //создание нового объекта TimeEntry
        const timeEntry = await prisma.timeEntry.create({
            data: {
                startTime: new Date(startTime),
                endTime: endTime ? new Date(endTime) : null,
                description: descriptrion || null, 
                categoryId: categoryId
            }, 
            include: {
                category: true
            }
        });
        
        //отправяем результат с кодовым состоянием
        res.status(201).json({
            success: true, 
            data: timeEntry
        });
    }
    catch (error) {
        console.error(error);

        //отправляем ошибку
        res.status(500).json({
            success: false,
            errror: 'Внутренняя ошибка сервера при создании timeEntry'
        });
    }
};

//получении всех записей времени
export const getAllTimeEntries = async (req: Request, res: Response) => { 
    try { 
        const entries = await prisma.timeEntry.findMany({
            include: { //содержат категорию
                category: true
            },
            orderBy: { //сортировка по убыванию
                startTime: 'desc'
            }
        });

        //возвращение результата
        res.json({
            success: true,
            data: entries
        });
    }
    //перехват ошибки при получении записей
    catch (error) { 
        console.error(error);
        res.status(500).json({
            success: false, 
            error: 'Ошибка при получении записей'
        });
    }
};

export default {
    createTimeEntry,
    getAllTimeEntries
};
