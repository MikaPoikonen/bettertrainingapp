import promisePool from "../utils/database.js";

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

export {getUserById, addUser};