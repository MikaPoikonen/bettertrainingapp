import express from 'express';
import { getUserByIdController, addUserController,updateUserController } from '../controllers/user-controller.js';

const userRouter = express.Router();

// users recource endpoints



userRouter
  .route('/:id')
  .get(getUserByIdController)
  .put(updateUserController);

userRouter
.route('/')
// POST - new user
.post(addUserController);



export default userRouter;