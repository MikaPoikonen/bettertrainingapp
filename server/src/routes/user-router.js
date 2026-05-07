import express from "express";
import { authenticateToken } from "../middlewares/authentication.js";
// User router: reitit käyttäjään liittyville toiminnoille, kuten omien tietojen haku, tietojen päivitys ja poisto, sekä kirjautuminen

// Käytetään kubios controlleria
import {
  getUserByIdController,
  addUserController,
  updateUserController,
  deleteUserController,
  //postLogin
} from "../controllers/user-controller.js";
import {
  userValidation,
  updateUserValidation,
} from "../middlewares/userValidation.js";
import validationErrorHandler from "../middlewares/error-handler.js";
import { postLogin, getMe } from "../controllers/kubios-auth-controller.js";

const userRouter = express.Router();

// Reitti käyttäjään liittyvälle datalle, kuten ikä, sukupuoli, paino ja pituus
userRouter
  .route("/:id")
  .get(getUserByIdController)
  .put(updateUserValidation, validationErrorHandler, updateUserController)
  .delete(deleteUserController);
// Reitti kirjautumiselle
userRouter.post("/login", postLogin);
// Reitti omien tietojen hakemiselle
userRouter
  .route("/")
  .get(authenticateToken, getMe)
  .post(userValidation, validationErrorHandler, addUserController);

export default userRouter;
