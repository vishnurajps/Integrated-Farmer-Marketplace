const PRODUCT_API_URL = "http://localhost:8080/api/products";

// ============================
// CHECK LOGIN
// ============================

const userId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");

const fullName =
    sessionStorage.getItem("fullName") ||
    localStorage.getItem("fullName");

const userRole =
    sessionStorage.getItem("userRole") ||
    localStorage.getItem("userRole");


// Redirect if user is not logged in

if (!userId) {

    window.location.href = "login.html";

}


// Prevent other roles from opening Farmer Dashboard

if (userRole !== "FARMER") {

    window.location.href = "login.html";

}


// ============================
// PAGE LOAD
// ============================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // DISPLAY USER NAME
    // ==========================

    const userName =
        document.getElementById("userName");

    const welcomeName =
        document.getElementById("welcomeName");


    if (userName) {

        userName.textContent =
            fullName || "Farmer";

    }


    if (welcomeName) {

        welcomeName.textContent =
            fullName || "Farmer";

    }


    // ==========================
    // CURRENT DATE
    // ==========================

    const currentDate =
        document.getElementById("currentDate");


    if (currentDate) {

        const today = new Date();

        currentDate.textContent =
            today.toDateString();

    }


    // ==========================
    // LOAD DASHBOARD PRODUCTS
    // ==========================

    loadDashboardProducts();

});


// ============================
// LOAD DASHBOARD PRODUCTS
// ============================

async function loadDashboardProducts() {

    try {

        const response = await fetch(
            `${PRODUCT_API_URL}/farmer/${userId}`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load farmer products"
            );

        }


        const products =
            await response.json();


        // ==========================
        // PRODUCT COUNT
        // ==========================

        const productCount =
            document.getElementById("productCount");


        if (productCount) {

            productCount.textContent =
                products.length;

        }


        // ==========================
        // RECENT PRODUCTS
        // ==========================

        displayRecentProducts(products);


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        const productCount =
            document.getElementById("productCount");


        if (productCount) {

            productCount.textContent = "0";

        }

    }

}


// ============================
// DISPLAY RECENT PRODUCTS
// ============================

function displayRecentProducts(products) {

    const tableBody =
        document.getElementById("recentProducts");


    if (!tableBody) {

        console.error(
            "recentProducts table body not found"
        );

        return;

    }


    // Clear existing rows

    tableBody.innerHTML = "";


    // ==========================
    // NO PRODUCTS
    // ==========================

    if (!products || products.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="4"
                    class="text-center text-muted">

                    No products added yet

                </td>

            </tr>

        `;

        return;

    }


    // ==========================
    // SHOW LAST 5 PRODUCTS
    // ==========================

    const recentProducts =
        products.slice(-5).reverse();


    recentProducts.forEach(function (product) {

        const row = `

            <tr>

                <td>
                    ${product.name || "-"}
                </td>

                <td>
                    ${product.category || "-"}
                </td>

                <td>
                    ${product.quantity ?? "-"}
                    ${product.unit || ""}
                </td>

                <td>
                    ₹${product.price ?? "-"}
                    ${product.unit ? "/" + product.unit : ""}
                </td>

            </tr>

        `;


        tableBody.innerHTML += row;

    });

    // ========================================
// LOGOUT
// ========================================

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    // Clear session login

    sessionStorage.removeItem("userId");

    sessionStorage.removeItem("fullName");

    sessionStorage.removeItem("userRole");


    // Clear remembered login

    localStorage.removeItem("userId");

    localStorage.removeItem("fullName");

    localStorage.removeItem("userRole");


    // Redirect to login

    window.location.href =
        "login.html";

}

}