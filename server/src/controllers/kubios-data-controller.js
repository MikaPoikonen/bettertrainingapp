import { KubiosResult } from "../models/kubios-model.js";
import { getUserData } from "../controllers/kubios-controller.js";

const KubiosResultController = async (req, res) => {
  const userId = req.user.userId;
  const kubiosData = await getUserData(req.user.kubiosToken);
  console.log(kubiosData)
  
  for (const item of kubiosData.results) {
    const payload = {
      user_id: userId,
      kubios_id: item.id,
      entry_date: item.date,
      hrv_data: item.hrv,
      readiness_data: item.readiness,
      stress_data: item.stress,
      physiological_age: item.physiological_age,
      bpm: item.bpm,
      mood: item.mood
    };
    
    const result = await KubiosResult(payload);
    
    if (result.error && result.error.includes("Duplicate")) {
      console.log("Skipping duplicate:", item.id);
    }
  }

  res.json({ message: "Kubios data synced" });
};

export {KubiosResultController}