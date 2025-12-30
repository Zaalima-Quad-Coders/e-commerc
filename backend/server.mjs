import app from './app.mjs';
import dotenv from 'dotenv';
import { connectDB } from './config/db.mjs';

dotenv.config( {path: 'backend/config/config.env' });


// Connecting to database
connectDB();

// Handle uncaught Exception errors
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.get("/api/v1/products", (req, res) =>{
    res.status(200).json({
        message:"all product"
    })
})
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
});