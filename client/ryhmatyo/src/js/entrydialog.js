import { fetchDiaryEntries, fetchLatestDiaryEntry, postEntry, updateEntry } from "./entry.js";
import "../../homepage/homepage.css";

const myUserId = localStorage.getItem("userId");


//Päivien formatointidunktiot
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
// Tekoälyltä haettu tieto formatointitapoihin ja itse sovellettu
// Formatoidaan päivämäärä ilman kellonaikaa
function formatDateClock(iso) {
  const d = new Date(iso);
  return d.toLocaleString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const diaryForm = document.querySelector('#add-entry-form');

/* Uusi päiväkirjamekintä -dialogi */

const diaryDialog = document.getElementById("diaryDialog");
const addDiaryBtn = document.getElementById("addDiaryBtn");
const saveDiaryBtn = document.getElementById("saveDiary");
const cancelDiaryBtn = document.getElementById("cancelDiary");
const diaryText = document.getElementById("diaryText");
const diaryEntries = document.getElementById("diaryEntries");
const overlay = document.getElementById("dialogOverlay");
const diaryDialogUpdate = document.getElementById("diaryDialogUpdate");
const cancelDiaryUpdateBtn = diaryDialogUpdate.querySelector("#cancelDiaryUpdate");
const saveDiaryUpdateBtn = document.getElementById("saveDiaryUpdate");
const putDiaryBtn = document.getElementById("putDiaryBtn");
const diaryTextUpdate = document.getElementById("diaryTextUpdate");
const diaryCard = document.querySelector(".diary-card");
const diaryHistoryDialog = document.getElementById("diaryHistoryDialog");
const diaryHistoryList = document.getElementById("diaryHistoryList");
const closeDiaryHistoryBtn = document.getElementById("closeDiaryHistory");
const diaryDate = document.getElementById("diaryDate");
const diaryMood = document.getElementById("diaryMood");
const diaryWeight = document.getElementById("diaryWeight");
const diarySleep = document.getElementById("diarySleep");




///////////////////////////////////////////////////
diaryCard.addEventListener("click", async(e) => {
  if (e.target.tagName === "BUTTON") return;

  await renderDiaryHistory();
  diaryHistoryDialog.showModal();
  overlay.style.display = "block";
});

closeDiaryHistoryBtn.addEventListener("click", () => {
  diaryHistoryDialog.close();
  overlay.style.display = "none";
});


addDiaryBtn.addEventListener("click", () => {
  diaryText.value = "";
  diaryDialog.showModal();
  overlay.style.display = "block";
});

cancelDiaryBtn.addEventListener("click", () => {
  diaryDialog.close();
  overlay.style.display = "none";
});

cancelDiaryUpdateBtn.addEventListener("click", () => {
  diaryDialogUpdate.close();
  overlay.style.display = "none";
});

putDiaryBtn.addEventListener("click", async () => {
  try {
    let entry = await fetchDiaryEntries();

    if (!entry) {
      alert("Ei merkintöjä muokattavaksi.");
      return;
    }

    // Jos backend joskus palauttaa listan, tee siitä lista
    if (Array.isArray(entry)) {
      entry = entry[0];
    }

    console.log("Muokataan merkintää:", entry);

    fillDiaryForm(entry);

  } catch (err) {
    console.error("Virhe merkintöjä haettaessa:", err);
  }
});

//Diary history dialog
async function renderDiaryHistory() {
  try {
    const result = await fetchDiaryEntries();
    const data = Array.isArray(result) ? result : [result];

    diaryHistoryList.innerHTML = "";

    if (data.length === 0) {
      diaryHistoryList.innerHTML = "<p>Ei päiväkirjamerkintöjä vielä.</p>";
      return;
    }

    data.forEach((row) => {
      const li = document.createElement("li");

      // --- EDIT BUTTON ---
      const editBtn = document.createElement("button");
      editBtn.textContent = "Muokkaa";
      editBtn.addEventListener("click", () => {
        fillDiaryForm(row);
        // diaryHistoryDialog.close();  // sulje vain jos haluat
      });

      // --- DELETE BUTTON ---
     // --- DELETE BUTTON ---
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Poista";

deleteBtn.addEventListener("click", async () => {
  if (!confirm("Haluatko varmasti poistaa tämän merkinnän?")) return;

  try {
    const response = await fetch("http://localhost:3000/api/entries", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    entry_id: row.entry_id,
    user_id: myUserId,
  }),
});

    if (!response.ok) {
      throw new Error("Poisto epäonnistui");
    }

    await renderDiaryHistory();
    await renderDiary();

  } catch (err) {
    console.error("Poisto epäonnistui:", err);
    alert("Merkinnän poisto epäonnistui.");
  }
});

      // --- CONTENT ---
      li.innerHTML = `
        Luotu: <strong>${formatDateClock(row.entry_date) || "-"}</strong><br><br>
        Päivä: ${formatDateClock(row.entry_date) || "-"}<br><br>
        Paino nyt: ${row.weight_now || "-"} kg<br>
        Uni: ${row.sleep_hours || "-"} tuntia<br>
        Mieliala: ${row.mood || "-"}<br>
        Muistiinpanot: ${row.notes || ""}<br><br>
      `;

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      diaryHistoryList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    diaryHistoryList.innerHTML = "<p>Merkintöjä ei voitu ladata.</p>";
  }
}






saveDiaryUpdateBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const entryId = diaryDialogUpdate.dataset.entryId;
  const userId = localStorage.getItem("userId");


  const updatedEntry = {
  entry_date: diaryDate.value,
  mood: diaryMood.value,
  weight_now: diaryWeight.value,
  sleep_hours: diarySleep.value,
  notes: diaryTextUpdate.value,
  entry_id: entryId
};


  try {
    await updateEntry(userId, updatedEntry);

    diaryDialogUpdate.close();
    overlay.style.display = "none";

    renderDiary(); // Päivitä lista

  } catch (err) {
    console.error("Päivitys epäonnistui", err);
  }
});



saveDiaryBtn.addEventListener("click", async () => {
  const notes = diaryText.value.trim();
  // if (!notes) return;

  const entry = {
    entry_date: new Date().toISOString().split("T")[0],
    mood: null,
    weight_now: null,
    sleep_hours: null,
    notes,
  };


  localDiaryEntries.unshift(entry);

  diaryDialog.close();
  overlay.style.display = "none";
  renderDiary();
});
overlay.addEventListener("click", () => {
  diaryDialog.close();
  overlay.style.display = "none";
});



// 🔹 Täyttää formiin arvot
function fillDiaryForm(row) {
  diaryDate.value = row.entry_date?.split("T")[0] || "";
  diaryMood.value = row.mood || "";
  diaryWeight.value = row.weight_now || "";
  diarySleep.value = row.sleep_hours || "";
  diaryTextUpdate.value = row.notes || "";

  diaryDialogUpdate.dataset.entryId = row.entry_id;

  diaryDialogUpdate.showModal();
  overlay.style.display = "block";
}

// 🔹 Renderöinti
// 🔹 Renderöinti korttiin: vain viimeisin merkintä
async function renderDiary() {
  try {
    const latest = await fetchLatestDiaryEntry();

    diaryEntries.innerHTML = "";

    if (!latest) {
      diaryEntries.innerHTML = "<p>Ei päiväkirjamerkintöjä vielä.</p>";
      return;
    }

    diaryEntries.innerHTML = `
      <div class="diary-entry">
        Luotu: <strong>${formatDateClock(latest.created_at) || "-"}</strong><br><br>
        Päivä: ${formatDateClock(latest.entry_date) || "-"}<br>
        Paino nyt: ${latest.weight_now || "-"} kg<br>
        Uni: ${latest.sleep_hours || "-"} tuntia<br>
        Mieliala: ${latest.mood || "-"}<br>
        Muistiinpanot: ${latest.notes || ""}<br><br>
      </div>
    `;
  } catch (err) {
    console.error(err);
    diaryEntries.innerHTML = "<p>Merkintää ei voitu ladata.</p>";
  }
}




renderDiary();











// Uuden päiväkirjamerkinnän renderöinti
diaryForm.addEventListener('submit', async (event) => 
  {event.preventDefault(); 
    const ent = new FormData(diaryForm); 

const payload = Object.fromEntries(ent.entries()); 
   //Numerokenttien muutokset: 
    payload.weight_now;
    payload.sleep_hours;
    payload.mood;
    payload.notes;
    payload.entry_date;

    let body ={
  "user_id":myUserId,
  "weight_now": Number(payload.weight_now),
  "mood": payload.mood,
  "sleep_hours": payload.sleep_hours,
  "notes": payload.notes,
  "entry_date": payload.entry_date,
}

    console.log(body)

  await postEntry(body); 
   diaryForm.reset();
   diaryDialog.close();
    overlay.style.display = "none"; 
   await renderDiary();
    })
