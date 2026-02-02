import 'dotenv/config';
import type { Request, Response, NextFunction } from 'express';
import { pool } from "./index.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const tokenBlacklist = new Set();

export class Users {

    static signToken = (username: string, user_id: string, role_id: string): string => {
        return jwt.sign({ username, user_id, role_id }, JWT_SECRET, { expiresIn: '1h' });
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
            console.error('Token verification failed:', error);
            return null;
        }
    };

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('req.body', req.body.username)
            const username = req.body.username
            const password = req.body.password;

            if (!username || !password) { res.status(401).json({ message: 'Invalid username or password' }); }

            const result = await pool.query('SELECT * FROM viewer.user WHERE username = $1 ', [username]);
            const storedHashedPassword = result.rows[0].password;
            const isValid = await bcrypt.compare(password, storedHashedPassword);
            console.log(password, storedHashedPassword);
            if (isValid) {
                const token = this.signToken(result.rows[0].username, result.rows[0].user_id, result.rows[0].role_id);
                res.status(200).json({ token });
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
            console.log('the logout token', token)
            if (token) {
                tokenBlacklist.add(token); // Add to blacklist
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

