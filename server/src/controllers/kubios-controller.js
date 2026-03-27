import fetch from 'node-fetch';
 // import {customError} from '../middlewares/error-handler.js';

 // Kubios API base URL should be set in .env
 const baseUrl = process.env.KUBIOS_API_URI;

 /**
 * Get user data from Kubios API example
 * TODO: Implement error handling
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getUserData = async (req, res, next) => {
   const {kubiosIdToken} = req.user;
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', kubiosIdToken);

   const response = await fetch(
     // TODO: set the from date more sophisticated way
     // in this example, data from 1.1.2024 is requested and hardcoded in the URL,
     // but it should be dynamic based on for example request parameters or some other date handling logic
     baseUrl + '/result/self?from=2024-01-01T00%3A00%3A00%2B00%3A00',
     {
       method: 'GET',
       headers: headers,
     },
   );
   const results = await response.json();

   // Kubiokselta saatua dataa voi käsitellä (palvelipuolella) tässä
   // ennen responsen lähettämistä client-sovellukselle
const formatted = results.results.map(item => ({
  kubios_id: item.measure_id,
  entry_date: "2026-02-02",
  hrv_data: item.result.rmssd_ms,
  readiness_data: item.result.readiness,
  stress_data: item.result.stress_index,
  physiological_age: item.result.physiological_age,
  bpm: item.result.mean_hr_bpm,
  mood: "kissa" // Kubios ei anna moodia tässä endpointissa
}));

return formatted
  };

 /**
 * Get user info from Kubios API example
 * TODO: Implement error handling
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getUserInfo = async (req, res, next) => {
   const {kubiosIdToken} = req.user;
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', kubiosIdToken);

   const response = await fetch(baseUrl + '/user/self', {
     method: 'GET',
     headers: headers,
   });
   const userInfo = await response.json();
   return res.json(userInfo);
 };

 export {getUserData, getUserInfo};