// ==========================================
// API URL
// ==========================================

const ORDER_API_URL =
    "http://localhost:8080/api/orders";


// ==========================================
// GET LOGGED-IN USER
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
// LOGIN CHECK
// ==========================================

if (!userId) {

    window.location.href =
        "login.html";

}


if (userRole !== "BUYER") {

    window.location.href =
        "login.html";

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ======================================
        // DISPLAY BUYER NAME
        // ======================================

        const buyerName =
            document.getElementById("buyerName");


        if (buyerName) {

            buyerName.textContent =
                fullName || "Buyer";

        }


        // ======================================
        // LOAD ORDERS
        // ======================================

        loadBuyerOrders();


        // ======================================
        // LOGOUT BUTTON
        // ======================================

        const logoutButton =
            document.getElementById("logoutButton");


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }


        // ======================================
        // SIDEBAR LOGOUT
        // ======================================

        const sidebarLogout =
            document.getElementById("sidebarLogout");


        if (sidebarLogout) {

            sidebarLogout.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logout();

                }
            );

        }

    }
);


// ==========================================
// LOAD BUYER ORDERS
// ==========================================

async function loadBuyerOrders() {

    const loadingContainer =
        document.getElementById(
            "loadingContainer"
        );


    const ordersContainer =
        document.getElementById(
            "ordersContainer"
        );


    const errorContainer =
        document.getElementById(
            "errorContainer"
        );


    try {

        // Show loading

        if (loadingContainer) {

            loadingContainer.classList.remove(
                "d-none"
            );

        }


        if (ordersContainer) {

            ordersContainer.classList.add(
                "d-none"
            );

        }


        if (errorContainer) {

            errorContainer.classList.add(
                "d-none"
            );

        }


        console.log(
            "Loading orders for Buyer ID:",
            userId
        );


        // ======================================
        // API REQUEST
        // ======================================

        const response =
            await fetch(

                `${ORDER_API_URL}/buyer/${userId}`

            );


        console.log(
            "Response Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load orders. Status: ${response.status}`
            );

        }


        const orders =
            await response.json();


        console.log(
            "Buyer Orders:",
            orders
        );


        // Hide loading

        if (loadingContainer) {

            loadingContainer.classList.add(
                "d-none"
            );

        }


        // Display orders

        displayOrders(orders);


        if (ordersContainer) {

            ordersContainer.classList.remove(
                "d-none"
            );

        }

    }

    catch (error) {

        console.error(
            "Buyer Orders Error:",
            error
        );


        if (loadingContainer) {

            loadingContainer.classList.add(
                "d-none"
            );

        }


        showError(
            "Unable to load your orders. " +
            "Please check the Spring Boot server and API connection."
        );

    }

}


// ==========================================
// DISPLAY ORDERS
// ==========================================

function displayOrders(orders) {

    const tableBody =
        document.getElementById(
            "ordersTableBody"
        );


    if (!tableBody) {

        console.error(
            "ordersTableBody not found"
        );

        return;

    }


    // Clear table

    tableBody.innerHTML = "";


    // ======================================
    // NO ORDERS
    // ======================================

    if (!orders || orders.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center text-muted py-4"
                >

                    <i class="bi bi-bag-x fs-3"></i>

                    <br>

                    <strong>

                        No orders found

                    </strong>

                    <br>

                    Start shopping to place your first order.

                </td>

            </tr>

        `;

        return;

    }


    // ======================================
    // DISPLAY EACH ORDER
    // ======================================

    orders.forEach(
        function (order) {


            const productName =

                order.product &&
                order.product.name

                    ? order.product.name

                    : "Unknown Product";


            const farmerName =

                order.farmer &&
                order.farmer.fullName

                    ? order.farmer.fullName

                    : "Unknown Farmer";


            const quantity =

                order.quantity ?? 0;


            const unit =

                order.product &&
                order.product.unit

                    ? order.product.unit

                    : "";


            const pricePerUnit =

                order.pricePerUnit ?? 0;


            const totalPrice =

                order.totalPrice ?? 0;


            const status =

                order.status || "PENDING";


            const orderDate =

                formatDateTime(
                    order.orderDate
                );


            const statusBadge =
                getStatusBadge(status);


            const row = `

                <tr>

                    <!-- ORDER ID -->

                    <td>

                        <strong>

                            #${order.id}

                        </strong>

                    </td>


                    <!-- PRODUCT -->

                    <td>

                        ${productName}

                    </td>


                    <!-- FARMER -->

                    <td>

                        ${farmerName}

                    </td>


                    <!-- QUANTITY -->

                    <td>

                        ${quantity} ${unit}

                    </td>


                    <!-- PRICE -->

                    <td>

                        ₹${pricePerUnit}

                    </td>


                    <!-- TOTAL -->

                    <td>

                        <strong>

                            ₹${totalPrice}

                        </strong>

                    </td>


                    <!-- STATUS -->

                    <td>

                        ${statusBadge}

                    </td>


                    <!-- DATE -->

                    <td>

                        ${orderDate}

                    </td>


                </tr>

            `;


            tableBody.innerHTML += row;

        }
    );

}


// ==========================================
// STATUS BADGE
// ==========================================

function getStatusBadge(status) {

    const normalizedStatus =
        status.toUpperCase();


    let badgeClass =
        "bg-secondary";


    if (normalizedStatus === "PENDING") {

        badgeClass =
            "bg-warning text-dark";

    }


    else if (normalizedStatus === "ACCEPTED") {

        badgeClass =
            "bg-primary";

    }


    else if (normalizedStatus === "CONFIRMED") {

        badgeClass =
            "bg-info text-dark";

    }


    else if (normalizedStatus === "DELIVERED") {

        badgeClass =
            "bg-success";

    }


    else if (normalizedStatus === "CANCELLED") {

        badgeClass =
            "bg-danger";

    }


    return `

        <span class="badge ${badgeClass}">

            ${status}

        </span>

    `;

}


// ==========================================
// FORMAT DATE AND TIME
// ==========================================

function formatDateTime(dateValue) {

    if (!dateValue) {

        return "-";

    }


    try {

        const date =
            new Date(dateValue);


        return date.toLocaleString(
            "en-IN",
            {

                day: "2-digit",

                month: "short",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit"

            }
        );

    }

    catch (error) {

        return dateValue;

    }

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    const errorContainer =
        document.getElementById(
            "errorContainer"
        );


    if (!errorContainer) {

        return;

    }


    errorContainer.classList.remove(
        "d-none"
    );


    errorContainer.innerHTML = `

        <div class="alert alert-danger text-center">

            <h5>

                <i class="bi bi-exclamation-triangle"></i>

                Error

            </h5>


            <p>

                ${message}

            </p>


            <button
                class="btn btn-success"
                onclick="loadBuyerOrders()"
            >

                Try Again

            </button>

        </div>

    `;

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    // Clear session

    sessionStorage.clear();


    // Clear login data

    localStorage.removeItem("userId");

    localStorage.removeItem("fullName");

    localStorage.removeItem("userRole");


    // Redirect

    window.location.href =
        "login.html";

}