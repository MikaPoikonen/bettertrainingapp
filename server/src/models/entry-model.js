import promisePool from "../utils/database.js";
// Entry model: tietokantakyselyt päiväkirjamerkinnöille, kuten merkinnän haku, lisäys, päivitys ja poisto

// Funktio hakee kaikki päiväkirjamerkinnät tietokannasta käyttäjään liittyen
const listAllEntriesById = async (id) => {
  try {
    const sql =
      "SELECT * FROM DiaryEntries WHERE user_id  = ? ORDER BY created_at DESC";
    const [rows] = await promisePool.execute(sql, [id]);
    return rows;
  } catch (e) {
    console.error("error", e.message);
    return { error: e.message };
  }
};

// addEntry: Funktio lisää uuden päiväkirjamerkinnän tietokantaan
const addEntry = async (entry) => {
  const { user_id, entry_date, mood, weight_now, sleep_hours, notes } = entry;
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood, weight_now, sleep_hours, notes)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, entry_date, mood, weight_now, sleep_hours, notes];
  try {
    const rows = await promisePool.execute(sql, params);
    return { entry_id: rows[0].insertId };
  } catch (error) {
    console.error("error", error.message);
    return { error: error.message };
  }
};

// Hakufunktio, joka hakee tietyn merkinnän id:llä
const getEntryById = async (id) => {
  try {
    const sql =
      "SELECT * FROM DiaryEntries WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
    const [rows] = await promisePool.execute(sql, [id]);
    return rows[0];
  } catch (e) {
    console.error("error", e.message);
    return { error: e.message };
  }
};

// Päiväkirjamerkinnän päivitys
const putEntry = async (entry) => {
  const {
    entry_id,
    user_id,
    entry_date,
    mood,
    weight_now,
    sleep_hours,
    notes,
  } = entry;
  const sql =
    "UPDATE DiaryEntries SET  entry_date = ?, mood = ?, weight_now = ?, sleep_hours = ?, notes = ? WHERE user_id = ? AND entry_id = ?";
  const params = [
    entry_date,
    mood,
    weight_now,
    sleep_hours,
    notes,
    user_id,
    entry_id,
  ];
  try {
    const rows = await promisePool.execute(sql, params);
    return { rows };
  } catch (e) {
    console.error("error", e.message);
    return { error: e.message };
  }
};

// Päiväkirjamerkinnän poisto
const removeEntryById = async (entry_id, user_id) => {
  const sql = "DELETE FROM DiaryEntries WHERE entry_id = ? AND user_id = ?";

  try {
    const [result] = await promisePool.execute(sql, [entry_id, user_id]);
    return result.affectedRows;
  } catch (e) {
    console.error("error", e.message);
    return { error: e.message };
  }
};

export {
  listAllEntriesById,
  addEntry,
  removeEntryById,
  getEntryById,
  putEntry,
};
