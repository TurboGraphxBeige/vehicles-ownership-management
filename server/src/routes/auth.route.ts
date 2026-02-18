// routes/auth.route.ts
import  express from 'express'
import { login, verifyToken, logout } from '../controllers/auth.controller.js'

const router = express.Router();

// Routes definition
router.post('/login', login);
router.post('/logout', logout);
router.post('/verifytoken', verifyToken);

export default router;
