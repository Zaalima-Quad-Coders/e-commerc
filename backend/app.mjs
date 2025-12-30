import express from 'express';
import product from './routes/productRoutes.mjs';
import errorHandleMiddleware from './middleware/error.mjs'; 

const app = express();


// Middleware to parse JSON requests
app.use(express.json());

// routes
app.use("/api/v1", product);
app.use(errorHandleMiddleware);
export default app;


