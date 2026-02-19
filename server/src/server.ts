// fileName: server
import 'dotenv/config';
import './models/index.js';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import vehicleRoutes from './routes/vehicles.route.js';
import brandsRoute from './routes/brands.route.js';
import authRoute from './routes/auth.route.js';
import modelsRoute from './routes/models.route.js';

const app = express();

// Configure CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your subdomain
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you need to send cookies or authorization headers
};

// Configure the rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(limiter);

// Routes
const router = express.Router();
app.get('/v1', (req: Request, res: Response) => {
    res.send('Cars API (v1)'); // You can send a welcome message or documentation
});

app.use('/v1', vehicleRoutes);
app.use('/v1', brandsRoute);
app.use('/v1', modelsRoute);
app.use('/v1', authRoute);


// Specify the port to listen on
const port = 3001;

// Start the server
app.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});

export default app;