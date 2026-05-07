import promisePool from "../utils/database.js";

// User model: tietokantakyselyt käyttäjille, kuten käyttäjään liittyvien tietojen haku, käyttäjään liittyvien tietojen lisäys, päivitys ja poisto

// get user by id
const findUserByUserName = async (username) => {
  const sql = "SELECT * FROM users where username = ?";
  const [rows] = await promisePool.execute(sql, [username]);
  return rows[0];
};

// Kubioksen hakua varten
const selectUserByEmail = async (email) => {
  try {
    const sql = "SELECT * FROM Users WHERE email=?";
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    // console.log(rows);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return { error: 404, message: "user not found" };
    }
    // Remove password property from result
    delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error("selectUserByEmail", error);
    return { error: 500, message: "db error" };
  }
};

// get usr by id

const getUserById = async (id) => {
  try {
    const [result] = await promisePool.execute(
      "SELECT * FROM Users WHERE user_id = ?",
      [id],
    );
    return result[0];
  } catch (e) {
    console.log("error", e.message);
  }
};

// POST - add a new user

const addUser = async (user) => {
  const { username, password, email, start_weight, birth_year } = user;
  const sql = `INSERT Users (username, password, email, start_weight, birth_year)
                 VALUES (?, ?, ?, ?, ?)`;
  const params = [username, password, email, start_weight, birth_year];
  try {
    const result = await promisePool.execute(sql, params);
    return { user_id: result[0].insertId };
  } catch (e) {
    console.error("error", e.message);
    return { error: e.message };
  }
};
// Sync Kubios user with local user database
const addUserKubios = async (user) => {
  const { username, password, email, birth_year } = user;
  const sql = `INSERT Users (username, password, email, birth_year)
                 VALUES (?, ?, ?, ?)`;
  const params = [username, password, email, birth_year];
  try {
    const result = await promisePool.execute(sql, params);
    return { user_id: result[0].insertId };
  } catch (e) {
    console.error("error", e.message);
    return { error: e.message };
  }
};

// Sync Kubios user with local user database
const putUser = async (user) => {
  const { user_id, username, password, email, start_weight, birth_year } = user;

  const fields = [];
  const params = [];

  if (username !== undefined) {
    fields.push("username = ?");
    params.push(username);
  }

  if (password !== undefined) {
    fields.push("password = ?");
    params.push(password);
  }

  if (email !== undefined) {
    fields.push("email = ?");
    params.push(email);
  }

  if (start_weight !== undefined) {
    fields.push("start_weight = ?");
    params.push(start_weight);
  }

  if (birth_year !== undefined) {
    fields.push("birth_year = ?");
    params.push(birth_year);
  }

  // Jos ei mitään päivitettävää
  if (fields.length === 0) {
    return { error: "No fields to update" };
  }

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
  params.push(user_id);

  try {
    const [rows] = await promisePool.execute(sql, params);
    return { rows };
  } catch (e) {
    console.error("error", e.message);
    return { error: e.message };
  }
};

// DELETE USER
const deleteUser = async (user_id) => {
  const sql = "DELETE FROM users WHERE user_id = ?";
  await promisePool.execute(sql, [entry_id, user_id]);
  return result.affectedRows;
};

export {
  getUserById,
  addUser,
  putUser,
  deleteUser,
  findUserByUserName,
  selectUserByEmail,
  addUserKubios,
};
