import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
    getUserById, addUser,putUser,deleteUser,findUserByUserName
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


// PUT USER
const updateUserController = async (req, res) => {
const user_id = req.params.id;
const { username, password, email } = req.body;


  const result = await putUser ({
    user_id,
    username,
    password,
    email
  });
     if (!result.error) {
      res.status(200).json({ message: 'Entry updated.', result });
    } else {
      res.status(500).json(result);
    }
};

const deleteUserController = async (req, res) => {
  try {
    const user_id = req.params.id;  // <-- tämä puuttui

    const result = await deleteUser(user_id);

    res.json({ success: true, deleted: result });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        details: null
      }
    });
  }
};


// Login controlleri // ei laitettu roter
const postLogin = async (req, res) => {
  const {username, password} = req.body;

  const user = await findUserByUserName(username);
  console.log(user);

  // haetaan käyttäjä-objekti käyttäjän nimen perusteella

  if (user) {
    // Jos asiakkaalta tullut salasana vastaa tietokannasta haettua salasana tiivistettä ehto on TRUE:
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      // TÄssä kohtaa luodaan JWT token käyttämällä sercret fron .env file
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }); // tehdään muuttuja, jwt käyttöön. Haetaan user, procress ja metodi. Aika kauanko voimassa
      return res.json({message: 'login ok', user, token});
    }
    return res.status(403).json({error: 'invalid password'});
  }
  res.status(404).json({error: 'user not found'});
};






export {getUserByIdController, addUserController,updateUserController, deleteUserController,postLogin};