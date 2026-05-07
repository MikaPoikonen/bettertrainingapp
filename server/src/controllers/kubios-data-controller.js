import { KubiosResult, getKubiosDataSql } from "../models/kubios-model.js";
import { getUserData } from "../controllers/kubios-controller.js";
// Kubios data controller: hakee dataa Kubios API:sta ja tallentaa sen tietokantaan, sekä hakee dataa sql:stä
const KubiosResultController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const kubiosData = await getUserData(req, res, next);

    for (const item of kubiosData) {
      const payload = {
        user_id: userId,
        kubios_id: item.kubios_id,
        entry_date: item.entry_date,
        hrv_data: item.hrv_data,
        readiness_data: item.readiness_data,
        stress_data: item.stress_data,
        physiological_age: item.physiological_age,
        bpm: item.bpm,
      };

      console.log("testikuorma", payload);
      const result = await KubiosResult(payload);

      if (result.error && result.error.includes("Duplicate")) {
        console.log("Skipping duplicate:", item.id);
      }
    }

    res.json({ message: "Kubios data synced" });
  } catch (err) {
    next(err);
  }
};

// Get Kubios data from sql
const kubiosDataSqlController = async (req, res) => {
  const kubiosSqlData = await getKubiosDataSql(req.params.id);
  if (kubiosSqlData) {
    res.json(kubiosSqlData);
  } else {
    res.sendstatus(404);
  }
};

export { KubiosResultController, kubiosDataSqlController };
