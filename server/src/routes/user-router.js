import express from 'express';
import { getUserByIdController, addUserController } from '../controllers/user-controller.js';

const userRouter = express.Router();

// users recource endpoints

userRouter
.route('/')
// POST - new user
.post(addUserController);

userRouter.get('/:id', getUserByIdController);

export default userRouter;