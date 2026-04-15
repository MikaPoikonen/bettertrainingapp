import { fetchData } from './fetch';


const fetchDiaryEntries = async () => {
  console.log('Päiväkirjamerkinnän haku Tietokannasta');

  const url = `http://localhost:3000/api/entries/latest/${localStorage.getItem('userId')}`;
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('userId');
  console.log('User ID:', user_id);
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const entryData = await fetchData(url, options);

  if (entryData.error) {
    console.log('Päiväkirjamerkinnän haku Tietokannasta epäonnistui');
    return;
  }
  console.log(entryData);
  return entryData;
};



const postEntry = async (payload) => {
  const url = `http://localhost:3000/api/entries`;
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  };
 const entryPost = await fetchData(url, options);

  if (entryPost.error) {
    console.log('Päiväkirjamerkinnän lähetys Tietokantaan epäonnistui');
    return;
  }
  console.log(entryPost);
  return entryPost;
};

export { fetchDiaryEntries,postEntry };
