import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Extend the Request interface to include custom properties
declare global {
    namespace Express {
        interface Request {
            client_info?: {
                username: string;
                user_id: string;
                role_id: string;
            };
            username?: string;
            user_id?: string;
            role_id?: string;
        }
    }
}

// Extend JwtPayload to match your token structure
declare module 'jsonwebtoken' {
    export interface JwtPayload {
        username: string;
        user_id: string;
        role_id: string;
    }
}

// Verify if client has a valid token
function isAuthenticated (req: Request, res: Response, next: NextFunction) {
    try {
        console.log("isAuthenticatedisAuthenticatedisAuthenticatedisAuthenticatedisAuthenticatedisAuthenticatedisAuthenticatedisAuthenticatedisAuthenticatedisAuthenticated");
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1]
        if (!token) { return res.status(401).send('No token provided'); }
        if (!process.env.JWT_SECRET) { return }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;;
        req.client_info = { username: decodedToken.username, user_id: decodedToken.userid, role_id: decodedToken.role_id };
        req.username = decodedToken.username;
        req.user_id = decodedToken.user_id;
        req.role_id = decodedToken.role_id;

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default isAuthenticated;