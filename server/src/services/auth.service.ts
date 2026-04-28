import type { Request, Response, NextFunction } from 'express';
import {sequelize, User, Role} from '../models/index.js';
import bcrypt from "bcrypt";
import jwt, {JwtPayload} from "jsonwebtoken";
import ms from "ms";
import { type StringValue } from 'ms';

const JWT_SECRET: string = process.env.JWT_SECRET || '' ;
const REFRESH_JWT_SECRET: string = process.env.REFRESH_JWT_SECRET || '';
const JWT_TOKEN_EXP: string = process.env.JWT_TOKEN_EXP || '' ;
const REFRESH_JWT_EXP: string = process.env.REFRESH_JWT_EXP || '';
const tokenBlacklist = new Set();

export class authService {

    static signToken = (username: string, user_id: string, role_id: string): string => {
        return jwt.sign({ username, user_id, role_id }, JWT_SECRET, { expiresIn: ms(JWT_TOKEN_EXP as StringValue) });
    };

    static signRefreshToken = (username: string, user_id: string, role_id: string): string => {
        return jwt.sign({ username, user_id, role_id }, REFRESH_JWT_SECRET, { expiresIn: ms(REFRESH_JWT_EXP as StringValue) });
    };

    static verifyToken = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        try {

            const token = authHeader?.split(' ')[1]
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const decoded = jwt.verify(token, JWT_SECRET)
            console.log('decoded', decoded)
            res.status(200).json(decoded)
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({message: 'token expired', expired: true})
            }
            else {
                console.error('Token verification failed33:', authHeader, error);
                return null;
            }
        }
    };

    static refreshToken = (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            const token = req.cookies?.refresh_token
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const decoded_temp: string|JwtPayload = jwt.verify(token, REFRESH_JWT_SECRET)
            if (typeof decoded_temp === 'string') {
                throw new Error('Invalid token type');
            }
            const decoded = decoded_temp as JwtPayload
            if (decoded) {
                const new_token= authService.signToken(decoded.username, decoded.user_id, decoded.role_id)
                const new_refresh_token= authService.signRefreshToken(decoded.username, decoded.user_id, decoded.role_id)

                const decodedtoken_temp: string|JwtPayload = jwt.verify(new_token, JWT_SECRET)

                if (typeof decodedtoken_temp === 'string') {
                    throw new Error('Invalid token type');
                }
                const decodedtoken = decodedtoken_temp as JwtPayload
                const decodedRefreshToken = jwt.verify(new_refresh_token, REFRESH_JWT_SECRET)
                res.cookie('refresh_token', new_refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'prod',
                    sameSite: 'strict',
                    maxAge: ms(REFRESH_JWT_EXP as StringValue)
                });
                res.status(200).json({ 'access_token': { 'token': new_token, 'username': decodedtoken.username, 'user_id': decodedtoken.user_id, 'role_id': decodedtoken.role_id, 'exp': decodedtoken.exp } });

            }

        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({message: 'token expired', expired: true})
            }
            else {
                console.error('Token refresh verification failed:', error);
                return null;
            }
        }
    };

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.body.username as string
            const password = req.body.password;

            if (!username || !password) { res.status(401).json({ message: 'Invalid username or password' }); }

            const user: User | null = await User.findOne({
                where: {
                    username: username
                }
            })
            const storedHashedPassword = user?.dataValues.password ? user.dataValues.password : null ;
            const isValid = await bcrypt.compare(password, storedHashedPassword);
            if (isValid) {
                const storedUsername: string = user!.dataValues.username
                const storedUserID: string = user!.dataValues.user_id
                const storedRoleID: string = user!.dataValues.role_id
                const token = this.signToken(storedUsername, storedUserID, storedRoleID);
                const refreshToken = this.signRefreshToken(storedUsername, storedUserID, storedRoleID);
                const decoded: string | JwtPayload = jwt.verify(token, JWT_SECRET)
                if (typeof decoded === 'string') {
                    throw new Error('Invalid token format')
                }

                const decodedtoken: JwtPayload = decoded
                const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_JWT_SECRET)
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'prod',
                    sameSite: 'strict',
                    maxAge: ms(REFRESH_JWT_EXP as StringValue)
                });
                res.status(200).json( { 'access_token': { 'token': token, 'username': storedUsername, 'user_id': storedUserID, 'role_id': storedRoleID, 'exp': decodedtoken.exp } } );
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

    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await User.findAll({
                attributes: ['user_id', 'first_name', 'last_name'],
            });
            res.status(200).json(users);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }


}


