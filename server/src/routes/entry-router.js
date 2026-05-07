import express from "express";
import {
  getEntriesById,
  addEntryController,
  deleteEntryByIdController,
  getEntryByIdController,
  updateEntryController,
} from "../controllers/entry-controller.js";
import { authenticateToken } from "../middlewares/authentication.js";
// Entry router: reitit päiväkirjamerkinnöille, kuten merkinnän haku, lisäys, päivitys ja poisto

const entryRouter = express.Router();
// Reitti merkinnän lisäykselle ja poisto id:llä
entryRouter
  .route("/")
  .post(authenticateToken, addEntryController)
  .delete(authenticateToken, deleteEntryByIdController);

// Reitti merkinnän päivitykselle ja hakuun id:lläs
entryRouter
  .route("/:id")
  .get(authenticateToken, getEntriesById)
  .put(authenticateToken, updateEntryController);

// Reitti viimeisimmän merkinnän hakuun id:llä
entryRouter.route("/latest/:id").get(authenticateToken, getEntryByIdController);

export default entryRouter;
