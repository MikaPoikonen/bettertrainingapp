document.querySelector(".loginform").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert("Kirjautuminen epäonnistui: " + data.error);
            return;
        }

        // Tallenna token
        localStorage.setItem("token", data.token);

        // Ohjaa eteenpäin
        window.location.href = "/homepage/homepage.html";

    } catch (err) {
        console.error("Login error:", err);
        alert("Virhe kirjautumisessa");
    }
});
