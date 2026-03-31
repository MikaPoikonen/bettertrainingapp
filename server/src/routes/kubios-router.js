import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {getUserData, getUserInfo} from '../controllers/kubios-controller.js';
import { KubiosResultController } from '../controllers/kubios-data-controller.js';

const kubiosRouter = express.Router();

kubiosRouter
  .get('/user-data', authenticateToken, getUserData)
  .get('/user-info', authenticateToken, getUserInfo);

//kubiosRouter.get('/sql', authenticateToken, getUserData);

kubiosRouter.post('/sql', authenticateToken, KubiosResultController);

export default kubiosRouter;