import express from 'express';
import { getEntriesById, addEntryController,deleteEntryByIdController, getEntryByIdController, updateEntryController } from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const entryRouter = express.Router();

entryRouter
.route('/')
.post(authenticateToken, addEntryController)
.delete(authenticateToken,deleteEntryByIdController);

entryRouter
.route('/:id')
.get(authenticateToken, getEntriesById)
.put(authenticateToken, updateEntryController);

entryRouter
.route('/latest/:id')
.get(authenticateToken, getEntryByIdController);

export default entryRouter;