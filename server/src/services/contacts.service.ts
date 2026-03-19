import type { Request, Response, NextFunction } from 'express';
import {sequelize, Contact} from '../models/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || '' ;
const tokenBlacklist = new Set();

export class contactsService {

    static async getContacts(req: Request, res: Response, next: NextFunction) {
        try {
            const contacts = await Contact.findAll();
            res.status(200).json(contacts);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }


}


