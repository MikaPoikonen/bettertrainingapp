import { fetchData } from "./fetch";

// Funktio hakee viimeisimmän päiväkirjamerkinnän tietokannasta
const fetchLatestDiaryEntry = async () => {
  console.log("Viimeisimmän päiväkirjamerkinnän haku");

  const url = `http://localhost:3000/api/entries/latest/${localStorage.getItem("userId")}`;
  const token = localStorage.getItem("token");

  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const entryData = await fetchData(url, options);

  if (entryData.error) {
    console.log("Viimeisimmän merkinnän haku epäonnistui");
    return;
  }

  return entryData;
};

// Funktio hakee kaikki päiväkirjamerkinnät tietokannasta
const fetchDiaryEntries = async () => {
  console.log("Päiväkirjamerkinnän haku Tietokannasta");

  const url = `http://localhost:3000/api/entries/${localStorage.getItem("userId")}`;
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userId");
  console.log("User ID:", user_id);
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const entryData = await fetchData(url, options);

  if (entryData.error) {
    console.log("Päiväkirjamerkinnän haku Tietokannasta epäonnistui");
    return;
  }
  console.log(entryData);
  return entryData;
};

// Funktio lähettää uuden päiväkirjamerkinnän tietokantaan
const postEntry = async (payload) => {
  const url = `http://localhost:3000/api/entries`;
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  };
  const entryPost = await fetchData(url, options);

  if (entryPost.error) {
    console.log("Päiväkirjamerkinnän lähetys Tietokantaan epäonnistui");
    return;
  }
  console.log(entryPost);
  return entryPost;
};

// Funktio päivittää olemassa olevan päiväkirjamerkinnän tietokannassa
const updateEntry = async (userId, updatedEntry) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/api/entries/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEntry),
      },
    );

    if (!response.ok) {
      throw new Error("Päivitys epäonnistui");
    }

    return await response.json();
  } catch (err) {
    console.error("Virhe PUT-kutsussa:", err);
    throw err;
  }
};

export { fetchDiaryEntries, fetchLatestDiaryEntry, postEntry, updateEntry };
