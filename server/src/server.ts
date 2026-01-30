// fileName: server.ts
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from 'cookie-parser';
// Import routes
import carsRoute from './routes/cars.route.ts';
import brandsRoute from './routes/brands.route.ts';
import authRoute from './routes/auth.route.ts';

const app = express();

// Configure CORS options
const corsOptions = {
    origin: 'http://proto-laptop', // Replace with your subdomain
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you need to send cookies or authorization headers
};

// Configure the rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

// Middlewares
app.use(cors(corsOptions));
app.use(express.json()); // Add this if you expect to handle JSON requests
app.use(helmet())
app.use(limiter)

// Routes
const router = express.Router();
app.get('/v1', (req: Request, res: Response) => {
    res.send('Cars API (v1)'); // You can send a welcome message or documentation
});

app.use('/v1', carsRoute);
app.use('/v1', brandsRoute);
app.use('/v1', authRoute);


// Specify the port to listen on
const port = 3001;

// Start the server
app.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});

export default app;