import { fetchData } from './fetch';

// 1. hae data
// 2. muotoile data
// 3. anna muotoiltu data graafikirjastolle

// Function to test and get user info from kubios API
const getUserInfo = async () => {
  console.log('Käyttäjän INFO Kubioksesta');

  const url = 'http://localhost:3000/api/kubios/user-info';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData);
};

// Function to get more actual data from Kubios API
const getUserDataSqlLatest = async () => {
  console.log('Käyttäjän DATA Kubioksesta');

  const url = `http://localhost:3000/api/kubios/sql/${localStorage.getItem('userId')}`;
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('userId');
  console.log('User ID:', user_id);
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData[0]);
  return userData[0];
};


const getUserDataSqlAll = async () => {
  console.log('Käyttäjän DATA Kubioksesta');

  const url = `http://localhost:3000/api/kubios/sql/${localStorage.getItem('userId')}`;
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('userId');
  console.log('User ID:', user_id);
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData);
  return userData;
};



const getUserData = async () => {
  console.log("Käyttäjän DATA Kubioksesta");

  const url = `http://localhost:3000/api/users/${localStorage.getItem('userId')}`;
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userId");
  console.log("User ID:", user_id);

  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };

  const usersData = await fetchData(url, options);

  if (usersData.error) {
    console.log("Käyttäjän tietojen haku Kubioksesta epäonnistui");
    return;
  }

  console.log("Tässä tiedot käyttäjästä", usersData);

  const birthDate = usersData.birth_year;
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate())
  ) {
    age--;
  }

  console.log("Ikä:", age);

  return {
    ...usersData,
    age: age,
  };
};






export { getUserDataSqlLatest, getUserInfo, getUserDataSqlAll, getUserData };