import { listAllEntriesById, addEntry } from '../models/entry-model.js';

const getEntriesById = async (req, res) => {
    const result = await listAllEntriesById(req.user.userId);
    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
}; 

// addEntry
const addEntryController = async (req, res) => {
    const {entry_date, mood, weight_now, sleep_hours, notes} = req.body;
    const user_id = req.user.userId;
   if (!entry_date || !user_id) {
    return res.sendStatus(400);
  }

  if (!mood && !weight_now && !sleep_hours && !notes) {
    return res.sendStatus(400);
  }

  // Lisää entry
  const result = await addEntry({ user_id, ...req.body });

  if (result.entry_id) {
    return res.status(201).json({
      message: "New entry added",
      ...result
    });
  } else {
    return res.status(500).json(result);
  }
};

export {getEntriesById, addEntryController};