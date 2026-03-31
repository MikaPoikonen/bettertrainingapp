
import '../css/main.css';

const dialog = document.getElementById("register_form");
const openBtn = document.getElementById("open_register_dialog");
const closeBtn = document.getElementById("close_register_dialog");
const overlay = document.getElementById("dialog_overlay");

const birthYearSelect = document.getElementById("birth_year");

for (let year = 2030; year >= 1910; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;

    if (year === 2000) {
        option.selected = true;
    }

    birthYearSelect.appendChild(option);
}

// Dialogin avaaminen
openBtn?.addEventListener("click", () => {
  dialog.showModal();
  overlay.style.display = "block";
});

// Dialogin sulkeminen X-napista
closeBtn?.addEventListener("click", () => {
  dialog.close();
  overlay.style.display = "none";
});

// Sulje klikkaamalla dialogin ulkopuolelle
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!inside) dialog.close();
});

// Sulkeminen
dialog.addEventListener("close", () => {
  overlay.style.display = "none"; 
});

// Formin käsittely
const form = dialog.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    email: document.getElementById("email").value.trim(),
    username: document.getElementById("reg_username").value.trim(),
    password: document.getElementById("reg_password").value.trim(),
    birth_year: document.getElementById("birth_year").value.trim(),
    start_weight: document.getElementById("start_weight").value.trim(),
  };

  console.log("Rekisteröintitiedot:", payload);

  form.reset();
  dialog.close();
});
