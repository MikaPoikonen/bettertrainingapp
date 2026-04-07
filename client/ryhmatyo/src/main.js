import "./css/main.css";
let name = localStorage.getItem("name");
document.querySelector(".username").textContent = name ? name : "vieras"; //Haetaan localStoragesta nimi ja asetetaan se elementtiin, jos nimeä ei löydy, asetetaan "vieras"

console.log("Ryhmasivu toimii");
console.log("Perkele");
