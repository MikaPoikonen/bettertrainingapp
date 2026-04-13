 /**
  * Authentication resource controller using Kubios API for login
 * @module controllers/auth-controller
 * @author mattpe <mattpe@metropolia.fi>
 * @requires jsonwebtoken
 * @requires bcryptjs
 * @requires dotenv
 * @requires models/user-model
 * @requires middlewares/error-handler
 * @exports postLogin
 * @exports getMe
 */

 //  import 'dotenv/config';
 import jwt from 'jsonwebtoken';
 import fetch, {Headers} from 'node-fetch';
 import {v4} from 'uuid';
//  import {customError} from '../middlewares/error-handler.js'; 
// Ei ole custom error käytössä
 import {
  getUserById,
  addUserKubios,
  selectUserByEmail,
 } from '../models/user-model.js';

 // Kubios API base URL should be set in .env
 const baseUrl = process.env.KUBIOS_API_URI;

 const assertEnv = (name) => {
   const value = process.env[name];

   if (!value) {
     const error = new Error(`Missing required environment variable: ${name}`);
     error.status = 500;
     throw error;
   }

   return value;
 };

 /**
 * Creates a POST login request to Kubios API
 * @async
 * @param {string} username Username in Kubios
 * @param {string} password Password in Kubios
 * @return {string} idToken Kubios id token
 */
 const kubiosLogin = async (username, password) => {
   if (!username || !password) {
     const error = new Error('Username and password are required');
     error.status = 400;
     throw error;
   }

   const csrf = v4();
   const headers = new Headers();
   headers.append('Cookie', `XSRF-TOKEN=${csrf}`);
   headers.append('User-Agent', assertEnv('KUBIOS_USER_AGENT'));
   const searchParams = new URLSearchParams();
   searchParams.set('username', username);
   searchParams.set('password', password);
   searchParams.set('client_id', assertEnv('KUBIOS_CLIENT_ID'));
   searchParams.set('redirect_uri', assertEnv('KUBIOS_REDIRECT_URI'));
   searchParams.set('response_type', 'token');
   searchParams.set('scope', 'openid');
   searchParams.set('_csrf', csrf);

   const options = {
     method: 'POST',
     headers: headers,
     redirect: 'manual',
     body: searchParams,
   };
    let response;
    try {
      response = await fetch(assertEnv('KUBIOS_LOGIN_URL'), options);
    } catch (err) {
      console.error('Kubios login error', err);
      const error = new Error('Login with Kubios failed');
      error.status = 500;
      throw error;
    }
    const location = response.headers.raw().location?.[0];
    if (!location) {
      const error = new Error('Kubios login failed: missing redirect location');
      error.status = 502;
      throw error;
    }
    // console.log(location);
    // If login fails, location contains 'login?null'
    if (location.includes('login?null')) {
      const error = new Error('Login with Kubios failed due bad username/password');
      error.status = 401;
      throw error;
    }
    // If login success, Kubios response location header
    // contains id_token, access_token and expires_in
    const regex = /id_token=(.*)&access_token=(.*)&expires_in=(.*)/;
    const match = location.match(regex);
    if (!match?.[1]) {
      const error = new Error('Kubios login failed: missing id token');
      error.status = 502;
      throw error;
    }
    const idToken = match[1];
    return idToken;
  };

 /**
 * Get user info from Kubios API
 * @async
 * @param {string} idToken Kubios id token
 * @return {object} user User info
 */
 const kubiosUserInfo = async (idToken) => {
   if (!idToken) {
     const error = new Error('Kubios id token missing');
     error.status = 500;
     throw error;
   }

   const headers = new Headers();
   headers.append('User-Agent', assertEnv('KUBIOS_USER_AGENT'));
   headers.append('Authorization', idToken);
   const response = await fetch(assertEnv('KUBIOS_API_URI') + '/user/self', {
      method: 'GET',
      headers: headers,
    });
   const responseJson = await response.json();
    if (responseJson.status === 'ok') {
      return responseJson.user;
    } else {
      const error = new Error('Kubios user info failed');
      error.status = 500;
      throw error;
    }
  };

 /**
 * Sync Kubios user info with local db
 * @async
 * @param {object} kubiosUser User info from Kubios API
 * @return {number} userId User id in local db
 */
 const syncWithLocalUser = async (kubiosUser) => {
   // Check if user exists in local db
   let userId;
   const result = await selectUserByEmail(kubiosUser.email);
   // If user with the email not found, create new user, otherwise use existing
   if (result.error) {
  
     // Create user
     const newUser = {
       username: kubiosUser.email,
       email: kubiosUser.email,
       // Random password, quick workaround for the required field
       password: v4(),
     };
     const newUserResult = await addUserKubios(newUser);
     userId = newUserResult.user_id;
   } else {
     userId = result.user_id;
   }
   console.log('syncWithLocalUser userId', userId);
   return userId;
 };

// const syncWithLocalUser = async (kubiosUser) => {
//   let userId;

//   const result = await selectUserByEmail(kubiosUser.email);
//   console.log("selectUserByEmail result:", result);

//   if (result.error) {
//     const newUser = {
//       username: kubiosUser.email,
//       email: kubiosUser.email,
//       password: v4(),
//     };

//     const newUserResult = await addUser(newUser);
//     console.log("addUser result:", newUserResult);

//     // Poimitaan user_id riippumatta rakenteesta
//     userId =
//       newUserResult?.user?.user_id ??
//       newUserResult?.user_id ??
//       null;
//   } else {
//     userId =
//       result?.user?.user_id ??
//       result?.user_id ??
//       null;
//   }

//   console.log("syncWithLocalUser userId:", userId);
//   return userId;
// };


 /**
 * User login
 * @async
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {object} user if username & password match
 */
  const postLogin = async (req, res, next) => {
    const {username, password} = req.body;
   // console.log('login', req.body);
   try {
     // Try to login with Kubios
     const kubiosIdToken = await kubiosLogin(username, password);
     const kubiosUser = await kubiosUserInfo(kubiosIdToken);
     const localUserId = await syncWithLocalUser(kubiosUser);
     // Include kubiosIdToken in the auth token used in this app
     // NOTE: What is the expiration time of the Kubios token?
      const token = jwt.sign(
        {userId: localUserId, kubiosIdToken},
        assertEnv('JWT_SECRET'),
        {
          expiresIn: assertEnv('JWT_EXPIRES_IN'),
        },
      );
     return res.json({
       message: 'Logged in successfully with Kubios',
       user: kubiosUser,
       user_id: localUserId,
       token,
     });
   } catch (err) {
     console.error('Kubios login error', err);
     return next(err);
   }
 };

 /**
 * Get user info based on token
 * @async
 * @param {object} req
 * @param {object} res
 * @return {object} user info
 */
 const getMe = async (req, res) => {
   const user = await getUserById(req.user.userId);
   res.json({user, kubios_token: req.user.kubiosIdToken});
 };

 export {postLogin, getMe};
