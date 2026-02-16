import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';

export const login =  async (req: Request, res: Response, next: NextFunction) => {
    authService.login(req, res, next)
};

export const verifyToken =  async (req: Request, res: Response, next: NextFunction) => {
    authService.verifyToken(req, res, next)
};
