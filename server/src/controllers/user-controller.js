import bcrypt from 'bcryptjs';

import {
    getUserById, addUser
} from '../models/user-model.js';

const getUserByIdController = async (req, res) => {
    const entry = await getUserById(req.params.id);
    if (entry) {
        res.json(entry);
    } else {
        res.sendstatus(404);
    }
};

// POST - add user
const addUserController = async (req, res) => {
    const newUser = req.body;

    if (!(newUser.username && newUser.password && newUser.email)) {
        return res.status(400).json({error: 'required fields missing'});
    }

    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;
    const newUserId = await addUser(newUser);
    res.status(201).json({message: 'new user added', user_id: newUserId});
};

export {getUserByIdController, addUserController};