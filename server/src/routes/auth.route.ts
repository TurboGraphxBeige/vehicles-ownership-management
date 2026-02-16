// routes/members
import  express from 'express'
//import 'dotenv/config';
import { logout } from "../controllers/login.js";
import { login, verifyToken } from '../controllers/auth.controller.js'


const router = express.Router();

// Routes definition
router.post('/login', login);
router.post('/logout', logout);
router.post('/verifytoken', verifyToken);

// Export the router module so that server can use it
export default router;
