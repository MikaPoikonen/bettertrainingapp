import express from "express";
import { authenticateToken } from "../middlewares/authentication.js";
import { getUserData, getUserInfo } from "../controllers/kubios-controller.js";
import {
  kubiosDataSqlController,
  KubiosResultController,
} from "../controllers/kubios-data-controller.js";

// Kubios router: reitit Kubios API:sta haetulle datalle, kuten datan tallennus ja datan haku sql:stä
const kubiosRouter = express.Router();
// Reitti käyttäjään liittyvälle datalle, kuten ikä, sukupuoli, paino ja pituus
kubiosRouter
  .get("/user-data", authenticateToken, getUserData)
  .get("/user-info", authenticateToken, getUserInfo);
// Reitti sql:stä haetulle datalle ilman id:tä, hakee kaikki datat käyttäjään liittyen
kubiosRouter.get("/sql", authenticateToken, getUserData);
//
kubiosRouter.post("/sql", authenticateToken, KubiosResultController);
// Reitti sql:stä haetulle datalle id:llä
kubiosRouter.get("/sql/:id", authenticateToken, kubiosDataSqlController);

export default kubiosRouter;
