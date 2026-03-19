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

export {getUserById}