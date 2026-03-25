import express from 'express';
import { getUserByIdController, addUserController,updateUserController } from '../controllers/user-controller.js';
import { userValidation, updateUserValidation } from '../middlewares/userValidation.js';
import validationErrorHandler from '../middlewares/error-handler.js';

const userRouter = express.Router();

// users recource endpoints



userRouter
  .route('/:id')
  .get(getUserByIdController)
  .put(
    updateUserValidation,
    validationErrorHandler,
    updateUserController
);

userRouter
  .route('/')
  .post(
    userValidation,
    validationErrorHandler,
    addUserController
  );




export default userRouter;