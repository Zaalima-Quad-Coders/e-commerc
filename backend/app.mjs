import express from 'express';
import product from './routes/productRoutes.mjs';
import user from './routes/userRoutes.mjs';
import errorHandleMiddleware from './middleware/error.mjs'; 
import cookieParser from 'cookie-parser';


const app = express();


// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use(errorHandleMiddleware);
export default app;


