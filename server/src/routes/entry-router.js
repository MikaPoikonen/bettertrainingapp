import express from 'express';
import { getEntriesById, addEntryController,deleteEntryByIdController, getEntryByIdController } from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const entryRouter = express.Router();

entryRouter
.route('/')
.post(authenticateToken, addEntryController)
.delete(authenticateToken,deleteEntryByIdController);

entryRouter
.route('/:id')
.get(authenticateToken, getEntriesById);

entryRouter
.route('/latest/:id')
.get(authenticateToken, getEntryByIdController);

export default entryRouter;