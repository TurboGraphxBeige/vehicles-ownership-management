// routes/members
import express from 'express';
import 'dotenv/config';
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import { getBrands } from "../controllers/vehicles.controller.js";

const router = express.Router();
router.use((req, res, next) => {
    isAuthenticated
    next()
})

// Routes definition
router.get('/brands', isAuthenticated, getBrands);
router.get('/brands/:id', getBrands);

// Export the router module so that server can use it
export default router;
