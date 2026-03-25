import promisePool from "../utils/database.js";



const findUserByUserName = async (username) => {
    const sql = 'SELECT * FROM users where username = ?';
    const [rows] = await promisePool.execute(sql, [username]);
    return rows[0];
}

// Kubioksen hakua varten
 const selectUserByEmail = async (email) => {
   try {
     const sql = 'SELECT * FROM Users WHERE email=?';
     const params = [email];
     const [rows] = await promisePool.query(sql, params);
     // console.log(rows);
     // if nothing is found with the user id, result array is empty []
     if (rows.length === 0) {
       return {error: 404, message: 'user not found'};
     }
     // Remove password property from result
     delete rows[0].password;
     return rows[0];
   } catch (error) {
     console.error('selectUserByEmail', error);
     return {error: 500, message: 'db error'};
   }
 };





// get usr by id

const getUserById = async (id) => {
    try{
        const [result] = await promisePool.execute(
            'SELECT * FROM Users WHERE user_id = ?',[id]
        );
       return result[0];
     
    } catch (e) {
        console.log('error', e.message);
    }
};

// POST - add a new user

const addUser = async (user) => {
    const {username, password, email, start_weight, birth_year} = user;
    const sql = `INSERT Users (username, password, email, start_weight, birth_year)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [username, password, email, start_weight, birth_year];
    try {
        const result = await promisePool.execute(sql, params);
        return {user_id: result[0].insertId};
    } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
    }
};


const putUser = async (user) => {
    const {user_id,username,password,email} = user;
    const sql = 'UPDATE users SET  username = ?, password = ?, email = ? WHERE user_id = ?'
    const params = [username,password,email,user_id];
    try {
    const rows = await promisePool.execute(sql,params);
        return {rows}; 
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const deleteUser = async (user_id) => {
    const sql = 'DELETE FROM users WHERE user_id = ?'
    const [result] = await promisePool.execute(sql, [user_id]);
    return result.affectedRows;
};




export {getUserById, addUser,putUser, deleteUser,findUserByUserName,selectUserByEmail};