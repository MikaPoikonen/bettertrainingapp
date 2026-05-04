
///////////////////////////////////
// Logout-nappi
// Logout-nappi
document.querySelector("#exit")?.addEventListener("click", () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    window.location.replace("index.html");
});