import express from 'express';
import { getStudent, postStudent } from '../controller/studentController.js';

const studentRouter = express.Router();

studentRouter.get('/',getStudent)
studentRouter.post('/', postStudent)

export default studentRouter;