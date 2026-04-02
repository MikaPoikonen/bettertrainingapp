import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {getUserData, getUserInfo} from '../controllers/kubios-controller.js';
import { kubiosDataSqlController, KubiosResultController } from '../controllers/kubios-data-controller.js';


const kubiosRouter = express.Router();

kubiosRouter
  .get('/user-data', authenticateToken, getUserData)
  .get('/user-info', authenticateToken, getUserInfo);

kubiosRouter.get('/sql', authenticateToken, getUserData);

kubiosRouter.post('/sql', authenticateToken, KubiosResultController);

kubiosRouter.get('/sql/:id', authenticateToken, kubiosDataSqlController);

export default kubiosRouter;