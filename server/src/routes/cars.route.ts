// routes/members.ts
import express from 'express';
import 'dotenv/config';
import multer from 'multer'
import isAuthenticated from "../middlewares/isAuthenticated.middleware.ts";
import { getCars, getCar, newCar, deleteVehicle } from "../controllers/cars.controller.ts";

// multer memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
})

const router = express.Router();
router.use('/cars', isAuthenticated);

// Routes definition
router.get('/cars', getCars);
router.get('/cars/:car_id', getCar);    // single
router.post('/cars', upload.single('file'), newCar)
router.delete('/cars/:vehicle_id', deleteVehicle)

// Export the router module so that server.ts can use it
export default router;
