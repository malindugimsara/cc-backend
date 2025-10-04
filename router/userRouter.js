import express from 'express';
import { getCurrentUser, googleLogin, loginUser, saveUser } from '../controller/usercontrolle.js';
import { get } from 'mongoose';

// Create a new router for user-related routes
const userRouter = express.Router();

// Define the route for saving a user
userRouter.post('/',saveUser)

// Define the route for logging in a user
userRouter.post('/login', loginUser)

//google login
userRouter.post('/google', googleLogin)

userRouter.get('/current', getCurrentUser);

export default userRouter;