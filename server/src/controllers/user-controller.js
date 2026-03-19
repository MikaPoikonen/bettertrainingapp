import bcrypt from 'bcryptjs';

import {
    getUserById
} from '../models/user-model.js';

const getUserByIdController = async (req, res) => {
    const entry = await getUserById(req.params.id);
    if (entry) {
        res.json(entry);
    } else {
        res.sendstatus(404);
    }
};

export {getUserByIdController};