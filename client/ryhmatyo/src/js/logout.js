// Logout-nappi ja toiminnot: poistaa tokenin localStoragesta ja ohjaa takaisin login-sivulle.
document.querySelector("#exit")?.addEventListener("click", () => {
  sessionStorage.clear();
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.replace("index.html");
});
