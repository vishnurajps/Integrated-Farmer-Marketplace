// ============================
// API URL
// ============================

const API_URL = "http://localhost:8080/api/auth/login";


// ============================
// SHOW / HIDE PASSWORD
// ============================

function togglePassword() {

    const password = document.getElementById("password");

    password.type =
        password.type === "password"
            ? "text"
            : "password";
}


// ============================
// MOBILE VALIDATION
// ============================

const mobile = document.getElementById("mobile");

mobile.addEventListener("input", function () {

    mobile.value =
        mobile.value.replace(/[^0-9]/g, "");

    const error =
        document.getElementById("mobileError");

    if (mobile.value.length === 0) {

        error.innerHTML = "";

    } else if (mobile.value.length === 10) {

        error.innerHTML = "✓ Valid Mobile Number";
        error.style.color = "green";

    } else {

        error.innerHTML =
            "Enter 10-digit Mobile Number";

        error.style.color = "red";
    }

});


// ============================
// LOGIN
// ============================

document.getElementById("loginForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();


        const mobileNumber =
            document.getElementById("mobile")
                .value
                .trim();


        const password =
            document.getElementById("password")
                .value;


        // ============================
        // VALIDATE MOBILE
        // ============================

        if (mobileNumber.length !== 10) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        // ============================
        // VALIDATE PASSWORD
        // ============================

        if (password.trim() === "") {

            alert("Password is required.");

            return;
        }


        const data = {

            mobile: mobileNumber,
            password: password

        };


        const loginButton =
            document.querySelector(
                "#loginForm button[type='submit']"
            );


        try {

            loginButton.disabled = true;

            loginButton.innerText =
                "Logging in...";


            // ============================
            // LOGIN API
            // ============================

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)

                });


            const result =
                await response.json();


            console.log(
                "Login Response:",
                result
            );


            // ============================
            // CHECK LOGIN RESULT
            // ============================

            if (
                !response.ok ||
                result.message !== "Login Successful"
            ) {

                alert(
                    result.message ||
                    "Login failed"
                );

                return;
            }


            // ============================
            // CHECK USER ID
            // ============================

            if (
                result.userId === null ||
                result.userId === undefined
            ) {

                console.error(
                    "User ID missing:",
                    result
                );

                alert(
                    "Login error: User information was not received."
                );

                return;
            }


            // =====================================
            // CLEAR OLD USER DATA FIRST
            // VERY IMPORTANT WHEN SWITCHING USERS
            // =====================================

            sessionStorage.clear();

            localStorage.removeItem("userId");
            localStorage.removeItem("fullName");
            localStorage.removeItem("userRole");


            // ============================
            // SAVE CURRENT SESSION
            // ============================

            sessionStorage.setItem(
                "userId",
                String(result.userId)
            );

            sessionStorage.setItem(
                "fullName",
                result.fullName || ""
            );

            sessionStorage.setItem(
                "userRole",
                result.role || ""
            );


            // ============================
            // REMEMBER ME
            // ============================

            const remember =
                document.getElementById("remember").checked;


            if (remember) {

                localStorage.setItem(
                    "userId",
                    String(result.userId)
                );

                localStorage.setItem(
                    "fullName",
                    result.fullName || ""
                );

                localStorage.setItem(
                    "userRole",
                    result.role || ""
                );

            }


            // ============================
            // DEBUG INFORMATION
            // ============================

            console.log(
                "Current User ID:",
                result.userId
            );

            console.log(
                "Current User:",
                result.fullName
            );

            console.log(
                "Current Role:",
                result.role
            );


            // ============================
            // REDIRECT BY ROLE
            // ============================

            if (result.role === "FARMER") {

                window.location.href =
                    "farmer-dashboard.html";

            }

            else if (result.role === "BUYER") {

                window.location.href =
                    "buyer-dashboard.html";

            }

            else if (result.role === "ADVISOR") {

                window.location.href =
                    "advisor-dashboard.html";

            }

            else {

                alert(
                    "Unknown User Role: " +
                    result.role
                );

            }

        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );

            alert(
                "Unable to connect to Spring Boot Server."
            );

        }

        finally {

            loginButton.disabled = false;

            loginButton.innerText = "Login";

        }

    });