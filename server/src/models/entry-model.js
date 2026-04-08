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

const getEntryById = async (id) => {
  try {
    const sql = 'SELECT * FROM DiaryEntries WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';
    const [rows] = await promisePool.execute(sql, [id]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};




// const listAllHealthyStatsByUser = async (id) => {
//     try {
//         const sql = 'SELECT * FROM dailyhealthstats WHERE user_id = ?';
//         const result = await promisePool.execute(sql,[id]);
//         const rows = result[0];
//         return rows;
//     } catch(e) {
//         console.error('error', e.message);
//         return {error: e.message}
//     }
// }





const removeEntryById = async (entry_id, user_id) => {
  const sql = 'DELETE FROM DiaryEntries WHERE entry_id=? AND user_id=?';
  
  try{
  const [result] = await promisePool.execute(sql[entry_id,user_id])
  return result.affectedRows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message}
  }
};








export {listAllEntriesById, addEntry, removeEntryById, getEntryById};