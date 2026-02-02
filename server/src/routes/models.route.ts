// routes/members
import express from 'express';
import 'dotenv/config';
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import { getModels } from "../controllers/vehicles.controller.js";

const router = express.Router();
router.use((req, res, next) => {
    isAuthenticated
    next()
})

// Routes definition
router.get('/models', isAuthenticated, getModels);

// Export the router module so that server can use it
export default router;
