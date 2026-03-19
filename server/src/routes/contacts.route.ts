// routes/contacts.route.ts
import  express from 'express'
import { getContacts } from '../controllers/contacts.controller.js'
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";

const router = express.Router();

// Routes definition
router.get('/contacts', isAuthenticated, getContacts);

export default router;
