const form = document.getElementById("test");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/test-message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Hello backend"
        })
    });

    const data = await response.json();

    console.log(data);
});