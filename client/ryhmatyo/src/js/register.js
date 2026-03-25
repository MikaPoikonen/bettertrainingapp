import '../css/main.css';

const dialog = document.getElementById("register_form");
const openBtn = document.getElementById("open_register_dialog");
const closeBtn = document.getElementById("close_register_dialog");

// Dialogin avaaminen
if (openBtn) {
  openBtn.addEventListener("click", () => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });
}

// Dialogin sulkeminen
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    if (dialog.open) dialog.close();
  });
}

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!inside) {
    dialog.close();
  }
});

const form = dialog.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); 

  // Haetaan kenttien arvot
  const payload = {
    email: document.getElementById("email").value.trim(),
    username: document.getElementById("reg_username").value.trim(),
    password: document.getElementById("reg_password").value.trim(),
    birth_year: document.getElementById("birth_year").value.trim(),
    start_weight: document.getElementById("start_weight").value.trim(),
  };

  console.log("Rekisteröintitiedot:", payload);

  // TODO tähän johonki pitää lisätä backend-kutsun
  // fetch("/api/register", {...})

  // Sulje dialogi
  form.reset();
  dialog.close();
});





