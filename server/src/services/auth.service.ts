import type { Request, Response, NextFunction } from 'express';
import {sequelize, User, Role} from '../models_seq/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || '' ;
const tokenBlacklist = new Set();

export class authService {

    static signToken = (username: string, user_id: string, role_id: string): string => {
        return jwt.sign({ username, user_id, role_id }, JWT_SECRET, { expiresIn: '1d' });
    };

    static verifyToken = (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(' ')[1]
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const decoded = jwt.verify(token, JWT_SECRET)
            res.status(200).json(decoded)
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({message: 'token expired', expired: true})
            }
            else {
                console.error('Token verification failed:', error);
                return null;
            }
        }
    };

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('req.body', req.body.username)
            const username = req.body.username as string
            const password = req.body.password;

            if (!username || !password) { res.status(401).json({ message: 'Invalid username or password' }); }

            //const result = await pool.query('SELECT * FROM viewer.user WHERE username = $1 ', [username]);
            const user: User | null = await User.findOne({
                where: {
                    username: username
                }
            })
            console.log('useruseruser', user)
            const storedHashedPassword = user?.dataValues.password ? user.dataValues.password : null ;
            const isValid = await bcrypt.compare(password, storedHashedPassword);
            console.log(password, storedHashedPassword);
            if (isValid) {
                const storedUsername: string = user!.dataValues.username
                const storedUserID: string = user!.dataValues.user_id
                const storedRoleID: string = user!.dataValues.role_id
                const token = this.signToken(storedUsername, storedUserID, storedRoleID);
                res.status(200).json({ token, 'username': storedUsername, 'user_id': storedUserID, 'role_id': storedRoleID });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async logout(req: Request, res: Response, next: NextFunction) {
        console.log('logout model called');
        console.log(req.headers)
        try {
            const token = req.headers.authorization;
            if (token) {
                tokenBlacklist.add(token);
                res.status(200).json({ message: 'Logged out successfully' });
            } else {
                res.status(400).json({ error: 'No token provided' });
            }
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }


}


