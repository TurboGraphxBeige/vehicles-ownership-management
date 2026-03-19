import type { Request, Response, NextFunction } from 'express';
import { contactsService } from '../services/contacts.service.js';


export const getContacts =  async (req: Request, res: Response, next: NextFunction) => {
    contactsService.getContacts(req, res, next)
};
