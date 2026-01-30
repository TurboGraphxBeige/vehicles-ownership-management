// routes/members.ts
import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import { login, logout, verifyToken } from "../controllers/login.ts";
// import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Routes definition
router.post('/login', login);
router.post('/logout', logout);
router.post('/verifytoken', verifyToken);

// Export the router module so that server.ts can use it
export default router;
