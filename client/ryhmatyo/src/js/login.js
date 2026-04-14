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
        console.log(data);
        const token = data.token;
        const userId = data.user_id;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        console.log(userId);



        const kubiosResponse = await fetch ("http://localhost:3000/api/kubios/sql",{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const kubiosData = await kubiosResponse.json();

        if (!kubiosResponse.ok) {
            console.error("Kubios SQL error:", kubiosData);
            alert("Kirjautuminen onnistui, mutta Kubios‑datan tallennus epäonnistui.");
            return;
        }

        console.log("Kubios SQL OK:", kubiosData);

        // Ohjaa eteenpäin
        window.location.href = "/homepage/homepage.html";

    } catch (err) {
        console.error("Login error:", err);
        alert("Virhe kirjautumisessa");
    }
});
