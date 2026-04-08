import { listAllEntriesById, addEntry,removeEntryById, getEntryById } from '../models/entry-model.js';

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

const getEntryByIdController = async (req, res) => {
  const result = await getEntryById(req.user.userId);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};





// Delete entry
const deleteEntryByIdController = async (req,res) => {
  const result = await removeEntryById(req.body.entry_id,req.user.user_id);
  if (!result.error){
    res.json(result)
  } else {
    res.status(500);
    res.json(result)
  }
}


export {getEntriesById, addEntryController,deleteEntryByIdController, getEntryByIdController};