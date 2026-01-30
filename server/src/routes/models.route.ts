// routes/members.ts
import express from 'express';
import 'dotenv/config';
import isAuthenticated from "../middlewares/isAuthenticated.middleware.ts";
import { getModels } from "../controllers/cars.controller.ts";

const router = express.Router();
router.use((req, res, next) => {
    isAuthenticated
    next()
})

// Routes definition
router.get('/models', isAuthenticated, getModels);

// Export the router module so that server.ts can use it
export default router;
