const themeButton = document.getElementById("themeToggle");

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.innerHTML = "☀️";
    } else {
        themeButton.innerHTML = "🌙";
    }

});