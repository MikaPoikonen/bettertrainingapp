import express from 'express';
import { getUserByIdController } from '../controllers/user-controller.js';

const userRouter = express.Router();

// users recource endpoints

userRouter.route('/')

userRouter.get('/:id',getUserByIdController);

export default userRouter;