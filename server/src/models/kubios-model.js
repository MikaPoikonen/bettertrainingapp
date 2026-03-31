import promisePool from "../utils/database.js";

const KubiosResult = async (payload) => {
    const sql = `INSERT INTO Kubios_payload 
    (user_id, 
    hrv_data, 
    readiness_data, 
    stress_data, 
    physiological_age, 
    bpm, 
    mood, 
    kubios_id, 
    entry_date )
    VALUES (?,?,?,?,?,?,?,?,?)`;

    const params = [
        payload.user_id,
        payload.hrv_data,
        payload.readiness_data,
        payload.stress_data, 
        payload.physiological_age,
        payload.bpm, 
        payload.mood, 
        payload.kubios_id, 
        payload.entry_date
    ];
    try {
    const [result] = await promisePool.execute(sql, params);
    return { entry_id: result.insertId };
  } catch (e) {
    console.error("Insert error:", e.message);
    return { error: e.message };
  }
};

export {KubiosResult}