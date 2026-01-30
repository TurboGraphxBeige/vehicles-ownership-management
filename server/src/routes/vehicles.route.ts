// routes/members
import express from 'express';
import 'dotenv/config';
import multer from 'multer'
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import {
    getVehicles,
    getVehicle,
    newVehicle,
    deleteVehicle,
} from "../controllers/vehicles.controller";

// multer memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
})

const router = express.Router();
router.use('/vehicles', isAuthenticated);

// Routes definition

router.get('/vehicles', getVehicles);
router.get('/vehicles/:vehicle_id', getVehicle);    // single
router.post('/vehicles', upload.single('file'), newVehicle)
router.delete('/vehicles/:vehicle_id', deleteVehicle)

// Export the router module so that server can use it
export default router;
