// routes/auth.route.ts
import  express from 'express'
import { login, verifyToken, refreshToken, logout, getUsers } from '../controllers/auth.controller.js'
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";

const router = express.Router();

// Routes definition
router.post('/login', login);
router.post('/logout', logout);
router.post('/verifytoken', verifyToken);
router.post('/refreshtoken', refreshToken);
router.get('/users', isAuthenticated, getUsers);

export default router;
