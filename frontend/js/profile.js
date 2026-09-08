const API_BASE_URL =
    "http://localhost:8080/api/auth";


// ============================
// GET LOGIN INFORMATION
// ============================

const userId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");


const userRole =
    sessionStorage.getItem("userRole") ||
    localStorage.getItem("userRole");


console.log("Profile User ID:", userId);

console.log("Profile User Role:", userRole);


// ============================
// CHECK LOGIN
// ============================

if (!userId) {

    alert("Please login first.");

    window.location.href = "login.html";

}


if (userRole !== "FARMER") {

    alert("Access denied.");

    window.location.href = "login.html";

}


// ============================
// LOAD PROFILE
// ============================

document.addEventListener(
    "DOMContentLoaded",

    function () {

        loadProfile();

        setupProfileForm();

        setupResetButton();

        setupLogout();

    }

);


// ============================
// LOAD PROFILE
// ============================

async function loadProfile() {


    try {

        console.log(
            "Calling:",
            `${API_BASE_URL}/users/${userId}`
        );


        const response =
            await fetch(
                `${API_BASE_URL}/users/${userId}`
            );


        console.log(
            "Profile Response Status:",
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Server Error:",
                errorText
            );


            throw new Error(errorText);

        }


        const user =
            await response.json();


        console.log(
            "Profile Data:",
            user
        );


        // ============================
        // DISPLAY HEADER
        // ============================

        document.getElementById(
            "profileName"
        ).textContent =
            user.fullName || "Farmer";


        document.getElementById(
            "profileRole"
        ).textContent =
            user.role || "FARMER";


        // ============================
        // DISPLAY FORM DATA
        // ============================

        document.getElementById(
            "fullName"
        ).value =
            user.fullName || "";


        document.getElementById(
            "mobile"
        ).value =
            user.mobile || "";


        document.getElementById(
            "email"
        ).value =
            user.email || "";


        document.getElementById(
            "role"
        ).value =
            user.role || "";


        document.getElementById(
            "state"
        ).value =
            user.state || "";


        document.getElementById(
            "district"
        ).value =
            user.district || "";


        document.getElementById(
            "address"
        ).value =
            user.address || "";


        // Store original data for reset

        window.originalProfile =
            { ...user };


    }

    catch (error) {

        console.error(
            "Profile Load Error:",
            error
        );


        alert(
            "Unable to load profile details. Check browser console."
        );

    }

}


// ============================
// PROFILE FORM
// ============================

function setupProfileForm() {


    const profileForm =
        document.getElementById(
            "profileForm"
        );


    profileForm.addEventListener(

        "submit",

        async function (event) {


            event.preventDefault();


            const profileData = {

                fullName:
                    document
                        .getElementById("fullName")
                        .value
                        .trim(),


                mobile:
                    document
                        .getElementById("mobile")
                        .value
                        .trim(),


                email:
                    document
                        .getElementById("email")
                        .value
                        .trim(),


                state:
                    document
                        .getElementById("state")
                        .value
                        .trim(),


                district:
                    document
                        .getElementById("district")
                        .value
                        .trim(),


                address:
                    document
                        .getElementById("address")
                        .value
                        .trim()

            };


            console.log(
                "Updating Profile:",
                profileData
            );


            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/users/${userId}`,

                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    profileData
                                )

                        }

                    );


                console.log(
                    "Update Response:",
                    response.status
                );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Update Server Error:",
                        errorText
                    );


                    alert(
                        errorText ||
                        "Unable to update profile."
                    );


                    return;

                }


                const updatedUser =
                    await response.json();


                console.log(
                    "Updated Profile:",
                    updatedUser
                );


                // ============================
                // UPDATE DISPLAY
                // ============================

                document.getElementById(
                    "profileName"
                ).textContent =
                    updatedUser.fullName;


                // ============================
                // UPDATE STORAGE
                // ============================

                sessionStorage.setItem(
                    "fullName",
                    updatedUser.fullName
                );


                if (
                    localStorage.getItem("userId")
                ) {

                    localStorage.setItem(
                        "fullName",
                        updatedUser.fullName
                    );

                }


                // Update reset data

                window.originalProfile =
                    { ...updatedUser };


                alert(
                    "Profile updated successfully!"
                );

            }

            catch (error) {

                console.error(
                    "Profile Update Error:",
                    error
                );


                alert(
                    "Unable to update profile."
                );

            }

        }

    );

}


// ============================
// RESET PROFILE
// ============================

function setupResetButton() {


    const resetButton =
        document.getElementById(
            "resetButton"
        );


    resetButton.addEventListener(

        "click",

        function () {


            if (!window.originalProfile) {

                loadProfile();

                return;

            }


            const user =
                window.originalProfile;


            document.getElementById(
                "fullName"
            ).value =
                user.fullName || "";


            document.getElementById(
                "mobile"
            ).value =
                user.mobile || "";


            document.getElementById(
                "email"
            ).value =
                user.email || "";


            document.getElementById(
                "state"
            ).value =
                user.state || "";


            document.getElementById(
                "district"
            ).value =
                user.district || "";


            document.getElementById(
                "address"
            ).value =
                user.address || "";

        }

    );

}


// ============================
// LOGOUT
// ============================

function setupLogout() {


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(

        "click",

        function (event) {


            event.preventDefault();


            sessionStorage.clear();

            localStorage.removeItem("userId");

            localStorage.removeItem("fullName");

            localStorage.removeItem("userRole");


            window.location.href =
                "../index.html";

        }

    );

}