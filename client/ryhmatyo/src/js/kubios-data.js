import { fetchData } from "./fetch";

// Function to test and get user info from kubios API
const getUserInfo = async () => {
  console.log("Käyttäjän INFO Kubioksesta");

  const url = "http://localhost:3000/api/kubios/user-info";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    return;
  }
};

// Function to get more actual data from Kubios API
const getUserDataSqlLatest = async () => {
  console.log("Käyttäjän DATA Kubioksesta");

  const url = `http://localhost:3000/api/kubios/sql/${localStorage.getItem("userId")}`;
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userId");
  console.log("User ID:", user_id);
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    return;
  }

  return userData[0];
};

//  Function to get all user data from Kubios API
const getUserDataSqlAll = async () => {
  console.log("Käyttäjän DATA Kubioksesta");

  const url = `http://localhost:3000/api/kubios/sql/${localStorage.getItem("userId")}`;
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userId");
  console.log("User ID:", user_id);
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    return;
  }

  return userData;
};

// Function to get user data from Kubios API and calculate age
const getUserData = async () => {
  console.log("Käyttäjän DATA Kubioksesta");

  const url = `http://localhost:3000/api/users/${localStorage.getItem("userId")}`;
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userId");
  console.log("User ID:", user_id);

  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };

  const usersData = await fetchData(url, options);

  if (usersData.error) {
    return;
  }

  const birthDate = usersData.birth_year;
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return {
    ...usersData,
    age: age,
  };
};

export { getUserDataSqlLatest, getUserInfo, getUserDataSqlAll, getUserData };
