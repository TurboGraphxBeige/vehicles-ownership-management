// routes/members.ts
import express from 'express';
import 'dotenv/config';
import isAuthenticated from "../middlewares/isAuthenticated.middleware.ts";
import { getBrands } from "../controllers/cars.controller.ts";

const router = express.Router();
router.use((req, res, next) => {
    isAuthenticated
    next()
})

// Routes definition
router.get('/brands', isAuthenticated, getBrands);
router.get('/brands/:id', getBrands);

// Export the router module so that server.ts can use it
export default router;
