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


// ==========================================
// ROLE CHECK
// ==========================================

if (userRole !== "FARMER") {

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
        // DISPLAY FARMER NAME
        // ======================================

        const farmerName =
            document.getElementById(
                "farmerName"
            );


        if (farmerName) {

            farmerName.textContent =
                fullName || "Farmer";

        }


        // ======================================
        // LOAD ORDERS
        // ======================================

        loadFarmerOrders();


        // ======================================
        // NAVBAR LOGOUT
        // ======================================

        document
            .getElementById("logoutButton")
            .addEventListener(
                "click",
                logout
            );


        // ======================================
        // SIDEBAR LOGOUT
        // ======================================

        document
            .getElementById("sidebarLogout")
            .addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logout();

                }
            );


    }
);


// ==========================================
// LOAD FARMER ORDERS
// ==========================================

async function loadFarmerOrders() {

    const tableBody =
        document.getElementById(
            "ordersTableBody"
        );


    try {

        console.log(
            "Loading orders for farmer:",
            userId
        );


        const response =
            await fetch(
                `${ORDER_API_URL}/farmer/${userId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load farmer orders"
            );

        }


        const orders =
            await response.json();


        console.log(
            "Farmer Orders:",
            orders
        );


        // Display summary

        updateOrderSummary(orders);


        // Display orders

        displayOrders(orders);


    }

    catch (error) {

        console.error(
            "Farmer Orders Error:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-danger p-4"
                >

                    Unable to load orders.

                    <br>

                    Make sure Spring Boot is running.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// UPDATE ORDER SUMMARY
// ==========================================

function updateOrderSummary(orders) {

    const totalOrders =
        orders.length;


    const pendingOrders =
        orders.filter(
            order =>
                order.status === "PENDING"
        ).length;


    const completedOrders =
        orders.filter(
            order =>
                order.status === "COMPLETED"
        ).length;


    document
        .getElementById("totalOrders")
        .textContent =
            totalOrders;


    document
        .getElementById("pendingOrders")
        .textContent =
            pendingOrders;


    document
        .getElementById("completedOrders")
        .textContent =
            completedOrders;

}


// ==========================================
// DISPLAY ORDERS
// ==========================================

function displayOrders(orders) {

    const tableBody =
        document.getElementById(
            "ordersTableBody"
        );


    // Clear table

    tableBody.innerHTML = "";


    // ======================================
    // NO ORDERS
    // ======================================

    if (!orders || orders.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center p-5 text-muted"
                >

                    <i
                        class="bi bi-cart-x"
                        style="font-size: 2rem;"
                    ></i>

                    <br><br>

                    No orders received yet.

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

                    : "-";


            const buyerName =
                order.buyer &&
                order.buyer.fullName

                    ? order.buyer.fullName

                    : "Buyer";


            const quantity =
                `${order.quantity ?? 0}
                 ${order.product?.unit || ""}`;


            const totalPrice =
                `₹${order.totalPrice ?? 0}`;


            const orderDate =
                formatDate(
                    order.orderDate
                );


            const statusBadge =
                getStatusBadge(
                    order.status
                );


            const row = `

                <tr>


                    <td>

                        #${order.id}

                    </td>


                    <td>

                        <strong>

                            ${productName}

                        </strong>

                    </td>


                    <td>

                        ${buyerName}

                    </td>


                    <td>

                        ${quantity}

                    </td>


                    <td>

                        <strong class="text-success">

                            ${totalPrice}

                        </strong>

                    </td>


                    <td>

                        ${orderDate}

                    </td>


                    <td>

                        ${statusBadge}

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

    if (status === "PENDING") {

        return `
            <span class="badge bg-warning text-dark">
                PENDING
            </span>
        `;

    }


    if (status === "ACCEPTED") {

        return `
            <span class="badge bg-primary">
                ACCEPTED
            </span>
        `;

    }


    if (status === "REJECTED") {

        return `
            <span class="badge bg-danger">
                REJECTED
            </span>
        `;

    }


    if (status === "COMPLETED") {

        return `
            <span class="badge bg-success">
                COMPLETED
            </span>
        `;

    }


    return `
        <span class="badge bg-secondary">
            ${status || "UNKNOWN"}
        </span>
    `;

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


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


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    // Clear session

    sessionStorage.clear();


    // Clear local storage login data

    localStorage.removeItem("userId");

    localStorage.removeItem("fullName");

    localStorage.removeItem("userRole");


    // Redirect

    window.location.href =
        "login.html";

}