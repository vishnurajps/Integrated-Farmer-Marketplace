// ===============================
// CURRENT DATE
// ===============================

const currentDate = document.getElementById("currentDate");

if (currentDate) {

    const today = new Date();

    currentDate.innerHTML = today.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ===============================
// GET LOGGED-IN USER
// ===============================

const userName = localStorage.getItem("userName");

if (userName) {

    const navbarName =
        document.getElementById("userName");

    const welcomeName =
        document.getElementById("welcomeName");


    if (navbarName) {

        navbarName.innerHTML = userName;

    }


    if (welcomeName) {

        welcomeName.innerHTML = userName;

    }

}


// ===============================
// LOGOUT
// ===============================

function logoutUser() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (confirmLogout) {

        // Remove login information

        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userMobile");


        // Go to home page

        window.location.href = "../index.html";

    }

}


// ===============================
// DARK MODE
// ===============================

const themeButton =
    document.getElementById("themeButton");


if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark-mode");

        }
    );

}


// ===============================
// SALES CHART
// ===============================

const chartElement =
    document.getElementById("salesChart");


if (chartElement) {

    new Chart(chartElement, {

        type: "bar",

        data: {

            labels: [],

            datasets: [{

                label: "Monthly Sales",

                data: []

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            }

        }

    });

}