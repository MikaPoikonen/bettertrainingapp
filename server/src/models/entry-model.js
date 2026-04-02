import promisePool from '../utils/database.js';

// listAllEntriesById
const listAllEntriesById = async (id) => {
  try {
    const sql = 'SELECT * FROM DiaryEntries WHERE user_id = ?';
    const [rows] = await promisePool.execute(sql, [id]);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

// addEntry
const addEntry = async (entry) => {
    const {user_id, entry_date, mood, weight_now, sleep_hours, notes} = entry;
    const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood, weight_now, sleep_hours, notes)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [user_id, entry_date, mood, weight_now, sleep_hours, notes];
    try {
        const rows = await promisePool.execute(sql, params);
        return {entry_id: rows[0].insertId};
    } catch (error) {
        console.error('error', error.message);
        return {error: error.message};
    }
};

export {listAllEntriesById, addEntry};