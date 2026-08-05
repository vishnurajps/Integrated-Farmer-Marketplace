// ============================
// Show / Hide Password
// ============================

function togglePassword() {

    const password = document.getElementById("password");

    password.type = password.type === "password" ? "text" : "password";

}

// ============================
// Mobile Validation
// ============================

const mobile = document.getElementById("mobile");

mobile.addEventListener("input", function () {

    mobile.value = mobile.value.replace(/[^0-9]/g, "");

    const error = document.getElementById("mobileError");

    if (mobile.value.length === 10) {

        error.innerHTML = "✓ Valid Mobile Number";
        error.style.color = "green";

    } else {

        error.innerHTML = "Enter 10-digit Mobile Number";
        error.style.color = "red";

    }

});

// ============================
// Login
// ============================

document.getElementById("loginForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const data = {

        mobile: document.getElementById("mobile").value.trim(),

        password: document.getElementById("password").value

    };

    try {

        const response = await fetch("http://localhost:8080/api/auth/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        alert(result.message);

        if (result.message !== "Login Successful") {
            return;
        }

        // ==========================
        // Redirect Based On Role
        // ==========================

        switch (result.role) {

            case "FARMER":
                window.location.href = "farmer-dashboard.html";
                break;

            case "BUYER":
                window.location.href = "buyer-dashboard.html";
                break;

            case "ADVISOR":
                window.location.href = "advisor-dashboard.html";
                break;

            default:
                alert("Unknown User Role");
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to Spring Boot Server.");

    }

});