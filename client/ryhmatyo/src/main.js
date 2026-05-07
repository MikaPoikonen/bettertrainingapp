import "./css/main.css";
// Tiedostot, jotka tuodaan main.js:ään
let name = localStorage.getItem("name");
document.querySelector(".username").textContent = name ? name : "vieras"; //Haetaan localStoragesta nimi ja asetetaan se elementtiin, jos nimeä ei löydy, asetetaan "vieras"
