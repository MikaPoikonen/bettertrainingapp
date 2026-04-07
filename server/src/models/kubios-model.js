import promisePool from "../utils/database.js";


// Kubios Cloudista
const KubiosResult = async (payload) => {
    const sql = `INSERT INTO Kubios_payload 
    (user_id, 
    hrv_data, 
    readiness_data, 
    stress_data, 
    physiological_age, 
    bpm,  
    kubios_id, 
    entry_date )
    VALUES (?,?,?,?,?,?,?,?)`;

    const params = [
        payload.user_id,
        payload.hrv_data,
        payload.readiness_data,
        payload.stress_data, 
        payload.physiological_age,
        payload.bpm,  
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



// Get Kubios data from sql
const getKubiosDataSql = async (user_id) => {
  try {
    const sql = `
      SELECT *,
      DATE_FORMAT(entry_date, '%Y-%m-%d') AS entry_date
      FROM Kubios_payload
      WHERE user_id = ? 
      ORDER BY entry_date DESC
    `;

    const [rows] = await promisePool.execute(sql, [user_id]);

    return rows; // this is an array of results
  } catch (e) {
    console.error("Can't find data:", e.message);
    return { error: e.message };
  }
};



export {KubiosResult, getKubiosDataSql}