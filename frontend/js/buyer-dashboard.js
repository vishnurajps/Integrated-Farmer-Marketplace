// ==========================================
// API URL
// ==========================================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products/available";


// ==========================================
// CHECK LOGIN
// ==========================================

const userId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");


const fullName =
    sessionStorage.getItem("fullName") ||
    localStorage.getItem("fullName");


const userRole =
    sessionStorage.getItem("userRole") ||
    localStorage.getItem("userRole");


// ==========================================
// REDIRECT IF NOT LOGGED IN
// ==========================================

if (!userId) {

    window.location.href = "login.html";

}


// ==========================================
// PREVENT OTHER ROLES
// ==========================================

if (userRole !== "BUYER") {

    window.location.href = "login.html";

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayUserInformation();

        displayCurrentDate();

        loadAvailableProducts();

        loadCartCount();

        setupLogout();

    }
);


// ==========================================
// DISPLAY USER INFORMATION
// ==========================================

function displayUserInformation() {

    const userName =
        document.getElementById("userName");


    const welcomeName =
        document.getElementById("welcomeName");


    if (userName) {

        userName.textContent =
            fullName || "Buyer";

    }


    if (welcomeName) {

        welcomeName.textContent =
            fullName || "Buyer";

    }

}


// ==========================================
// DISPLAY CURRENT DATE
// ==========================================

function displayCurrentDate() {

    const currentDate =
        document.getElementById("currentDate");


    if (currentDate) {

        const today =
            new Date();


        currentDate.textContent =
            today.toDateString();

    }

}


// ==========================================
// LOAD AVAILABLE PRODUCTS
// ==========================================

async function loadAvailableProducts() {

    try {

        const response =
            await fetch(PRODUCT_API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        const products =
            await response.json();


        console.log(
            "Available Products:",
            products
        );


        // ==================================
        // PRODUCT COUNT
        // ==================================

        const productCount =
            document.getElementById(
                "productCount"
            );


        if (productCount) {

            productCount.textContent =
                products.length;

        }


        // ==================================
        // DISPLAY PRODUCTS
        // ==================================

        displayRecentProducts(products);

    }

    catch (error) {

        console.error(
            "Buyer Dashboard Error:",
            error
        );


        const tableBody =
            document.getElementById(
                "recentProducts"
            );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="text-center text-danger">

                        Unable to load products

                    </td>

                </tr>

            `;

        }

    }

}


// ==========================================
// DISPLAY RECENT PRODUCTS
// ==========================================

function displayRecentProducts(products) {

    const tableBody =
        document.getElementById(
            "recentProducts"
        );


    if (!tableBody) {

        console.error(
            "recentProducts element not found"
        );

        return;

    }


    // Clear old content

    tableBody.innerHTML = "";


    // ======================================
    // NO PRODUCTS
    // ======================================

    if (!products || products.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center text-muted">

                    No products available

                </td>

            </tr>

        `;

        return;

    }


    // ======================================
    // SHOW ONLY FIRST 5 PRODUCTS
    // ======================================

    const recentProducts =
        products.slice(0, 5);


    recentProducts.forEach(
        function (product) {

            // ==============================
            // PRODUCT IMAGE
            // ==============================

            let imageUrl =
                product.imageUrl;


            if (
                !imageUrl ||
                imageUrl.trim() === ""
            ) {

                imageUrl =
                    "../images/no-image.png";

            }


            // ==============================
            // CREATE ROW
            // ==============================

            const row = `

                <tr>

                    <td>

                        <img
                            src="${imageUrl}"
                            alt="${product.name}"
                            width="60"
                            height="60"
                            style="
                                object-fit: cover;
                                border-radius: 8px;
                            "

                            onerror="
                                this.src='../images/no-image.png'
                            "
                        >

                    </td>


                    <td>

                        <strong>

                            ${product.name || "-"}

                        </strong>

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

                        ${product.unit
                            ? "/" + product.unit
                            : ""
                        }

                    </td>


                </tr>

            `;


            tableBody.innerHTML += row;

        }

    );

}


// ==========================================
// LOAD CART COUNT
// ==========================================

function loadCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }

}


// ==========================================
// LOGOUT
// ==========================================

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


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            // Clear session

            sessionStorage.clear();

            localStorage.removeItem(
                "userId"
            );

            localStorage.removeItem(
                "fullName"
            );

            localStorage.removeItem(
                "userRole"
            );


            // Redirect

            window.location.href =
                "login.html";

        }
    );

}