import express from 'express';
import { authenticateToken } from '../middlewares/authentication.js';

// Käytetään kubios controlleria
import { 
  getUserByIdController, 
  addUserController,
  updateUserController, 
  deleteUserController, 
  //postLogin 
} from '../controllers/user-controller.js';
import { userValidation, updateUserValidation } from '../middlewares/userValidation.js';
import validationErrorHandler from '../middlewares/error-handler.js';
import { postLogin,getMe } from '../controllers/kubios-auth-controller.js';

const userRouter = express.Router();

// users recource endpoints



userRouter
  .route('/:id')
  .get(getUserByIdController)
  .put(
    updateUserValidation,
    validationErrorHandler,
    updateUserController)
  .delete(deleteUserController);  

userRouter.post('/login', postLogin)  

userRouter
  .route('/')
  .get(authenticateToken, getMe)
  .post(
    userValidation,
    validationErrorHandler,
    addUserController
  );




export default userRouter;
