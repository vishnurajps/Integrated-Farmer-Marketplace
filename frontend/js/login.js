// ============================
// API URL
// ============================

const API_URL = "http://localhost:8080/api/auth/login";


// ============================
// Show / Hide Password
// ============================

function togglePassword() {

    const password =
        document.getElementById("password");

    password.type =
        password.type === "password"
            ? "text"
            : "password";

}


// ============================
// Mobile Validation
// ============================

const mobile =
    document.getElementById("mobile");


mobile.addEventListener("input", function () {

    mobile.value =
        mobile.value.replace(/[^0-9]/g, "");


    const error =
        document.getElementById("mobileError");


    if (mobile.value.length === 0) {

        error.innerHTML = "";

    }

    else if (mobile.value.length === 10) {

        error.innerHTML =
            "✓ Valid Mobile Number";

        error.style.color = "green";

    }

    else {

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

            alert(
                "Password is required."
            );

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

            // ============================
            // DISABLE BUTTON
            // ============================

            loginButton.disabled = true;

            loginButton.innerText =
                "Logging in...";


            // ============================
            // CALL BACKEND API
            // ============================

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(data)

                });


            const result =
                await response.json();


            console.log(
                "Login Response:",
                result
            );


            // ============================
            // LOGIN FAILED
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
            // CHECK USER DATA
            // ============================

            if (!result.userId) {

                console.error(
                    "userId was not returned by backend:",
                    result
                );

                alert(
                    "Login error: User ID not received from server."
                );

                return;

            }


            // ============================
            // SAVE SESSION INFORMATION
            // ============================

            sessionStorage.setItem(
                "userId",
                result.userId
            );

            sessionStorage.setItem(
                "fullName",
                result.fullName
            );

            sessionStorage.setItem(
                "userRole",
                result.role
            );


            // ============================
            // REMEMBER ME
            // ============================

            const remember =
                document.getElementById("remember").checked;


            if (remember) {

                localStorage.setItem(
                    "userId",
                    result.userId
                );

                localStorage.setItem(
                    "fullName",
                    result.fullName
                );

                localStorage.setItem(
                    "userRole",
                    result.role
                );

            }

            else {

                // Remove old remembered login

                localStorage.removeItem("userId");

                localStorage.removeItem("fullName");

                localStorage.removeItem("userRole");

            }


            console.log(
                "Logged in User ID:",
                result.userId
            );

            console.log(
                "Logged in User:",
                result.fullName
            );

            console.log(
                "Role:",
                result.role
            );


            // ============================
            // REDIRECT BASED ON ROLE
            // ============================

            switch (result.role) {

                case "FARMER":

                    window.location.href =
                        "farmer-dashboard.html";

                    break;


                case "BUYER":

                    window.location.href =
                        "buyer-dashboard.html";

                    break;


                case "ADVISOR":

                    window.location.href =
                        "advisor-dashboard.html";

                    break;


                default:

                    alert(
                        "Unknown User Role"
                    );

            }


        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            alert(
                "Unable to connect to Spring Boot Server. " +
                "Make sure the backend is running."
            );

        }

        finally {

            loginButton.disabled = false;

            loginButton.innerText =
                "Login";

        }

    });