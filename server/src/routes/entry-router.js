import express from 'express';
import { getEntriesById, addEntryController } from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const entryRouter = express.Router();

entryRouter
.route('/')
.post(authenticateToken, addEntryController);

entryRouter
.route('/:id')
.get(authenticateToken, getEntriesById);

export default entryRouter;