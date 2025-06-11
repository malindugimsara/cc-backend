import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import userRouter from './router/userRouter.js';
import productRouter from './router/productRouter.js';
import authjwt from './middleware/auth.js';
import orderRouter from './router/orderRouter.js';

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:123@cluster0.zblwsvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then
(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Middleware 
app.use(bodyParser.json());

app.use(authjwt)

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

