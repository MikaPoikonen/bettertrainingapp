import {fetchDiaryEntries} from "./entry.js";
import "../../homepage/homepage.css";
import { postEntry } from "./entry.js";

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


addDiaryBtn.addEventListener("click", () => {
  diaryText.value = "";
  diaryDialog.showModal();
  overlay.style.display = "block";
});

cancelDiaryBtn.addEventListener("click", () => {
  diaryDialog.close();
  overlay.style.display = "none";
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



// Viimeisimmän päiväkirjamerkinnän haku ja renderöinti
async function renderDiary() {
  try {
    const result = await fetchDiaryEntries();

    // Ensure it's always an array
    const data = Array.isArray(result) ? result : [result];

    diaryEntries.innerHTML = "";

    if (data.length === 0) {
      diaryEntries.innerHTML = "<p>Ei päiväkirjamerkintöjä vielä.</p>";
      return;
    }

    data.forEach((row) => {
      const li = document.createElement("li");

      li.innerHTML = `
        Luotu: <strong>${formatDateClock(row.created_at) || "-"}</strong><br><br>
        Päivä: ${formatDateClock(row.entry_date) || "-"}<br>
        Paino nyt: ${row.weight_now || "-"} kg<br>
        Uni: ${row.sleep_hours || "-"} tuntia<br>
        Olotila: ${row.mood || "-"}<br>
        Muistiinpanot: ${row.notes || ""}
      `;

      diaryEntries.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    diaryEntries.innerHTML = "<p>Merkintöjä ei voitu ladata.</p>";
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
