import type { Request, Response, NextFunction } from 'express';
import { Users } from '../models/users.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Users.login(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Users.logout(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Users.verifyToken(req, res, next);
    } catch (error) {
        next(error);
    }
};