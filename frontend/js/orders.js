// ==========================================
// FARMER ORDERS PAGE
// ==========================================

console.log("ORDERS.JS LOADED");


// ==========================================
// API URL
// ==========================================

const ORDER_API_URL =
    "http://localhost:8080/api/orders";


// ==========================================
// GLOBAL ORDERS
// ==========================================

let allOrders = [];


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
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("User ID:", userId);
        console.log("User Role:", userRole);


        // ==================================
        // LOGIN CHECK
        // ==================================

        if (!userId) {

            alert("Please login first.");

            window.location.href =
                "login.html";

            return;

        }


        // ==================================
        // ROLE CHECK
        // ==================================

        if (userRole !== "FARMER") {

            alert("Only farmers can access this page.");

            window.location.href =
                "login.html";

            return;

        }


        // ==================================
        // LOAD ORDERS
        // ==================================

        loadOrders();


        // ==================================
        // SEARCH
        // ==================================

        const searchInput =
            document.getElementById("searchInput");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterOrders
            );

        }


        // ==================================
        // STATUS FILTER
        // ==================================

        const statusFilter =
            document.getElementById("statusFilter");


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                filterOrders
            );

        }


        // ==================================
        // LOGOUT
        // ==================================

        const logoutButton =
            document.getElementById("logoutButton");


        if (logoutButton) {

            logoutButton.addEventListener(
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
// LOAD FARMER ORDERS
// ==========================================

async function loadOrders() {

    const tableBody =
        document.getElementById("ordersTableBody");


    if (!tableBody) {

        console.error(
            "ordersTableBody not found"
        );

        return;

    }


    // ======================================
    // LOADING
    // ======================================

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center p-4">
                Loading orders...
            </td>
        </tr>
    `;


    try {

        const apiUrl =
            `${ORDER_API_URL}/farmer/${userId}`;


        console.log(
            "Calling API:",
            apiUrl
        );


        const response =
            await fetch(apiUrl);


        console.log(
            "Response Status:",
            response.status
        );


        // ==================================
        // ERROR
        // ==================================

        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                `Server error: ${response.status}`
            );

        }


        // ==================================
        // GET DATA
        // ==================================

        const orders =
            await response.json();


        console.log(
            "Orders Received:",
            orders
        );


        // ==================================
        // SAVE ORDERS
        // ==================================

        allOrders =
            Array.isArray(orders)
                ? orders
                : [];


        // ==================================
        // UPDATE SUMMARY
        // ==================================

        updateSummary(allOrders);


        // ==================================
        // DISPLAY
        // ==================================

        displayOrders(allOrders);

    }

    catch (error) {

        console.error(
            "ERROR LOADING ORDERS:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center text-danger p-4"
                >
                    <strong>
                        Unable to load orders.
                    </strong>

                    <br>

                    <small>
                        ${error.message}
                    </small>
                </td>
            </tr>
        `;

    }

}


// ==========================================
// UPDATE ORDER SUMMARY
// ==========================================

function updateSummary(orders) {

    const totalOrders =
        orders.length;


    const pendingOrders =
        orders.filter(
            order =>
                order.status === "PENDING"
        ).length;


    const acceptedOrders =
        orders.filter(
            order =>
                order.status === "ACCEPTED"
        ).length;


    const totalElement =
        document.getElementById("totalOrders");


    const pendingElement =
        document.getElementById("pendingOrders");


    const acceptedElement =
        document.getElementById("acceptedOrders");


    if (totalElement) {

        totalElement.textContent =
            totalOrders;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pendingOrders;

    }


    if (acceptedElement) {

        acceptedElement.textContent =
            acceptedOrders;

    }

}


// ==========================================
// DISPLAY ORDERS
// ==========================================

function displayOrders(orders) {

    const tableBody =
        document.getElementById("ordersTableBody");


    if (!tableBody) {

        return;

    }


    // ======================================
    // CLEAR TABLE
    // ======================================

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
                    No orders received yet.
                </td>
            </tr>
        `;

        return;

    }


    // ======================================
    // DISPLAY ORDERS
    // ======================================

    orders.forEach(
        function (order) {


            // ==================================
            // ORDER ID
            // ==================================

            const orderId =
                order.id ?? "-";


            // ==================================
            // BUYER NAME
            // ==================================

            const buyerName =
                order.buyer?.fullName ||
                order.buyer?.name ||
                "Unknown Buyer";


            // ==================================
            // PRODUCT NAME
            // ==================================

            const productName =
                order.product?.name ||
                "Unknown Product";


            // ==================================
            // QUANTITY
            // ==================================

            const quantityValue =
                order.quantity ?? 0;


            const unit =
                order.product?.unit || "";


            const quantity =
                `${quantityValue} ${unit}`;


            // ==================================
            // TOTAL PRICE
            // ==================================

            const totalPrice =
                Number(
                    order.totalPrice ?? 0
                );


            // ==================================
            // STATUS
            // ==================================

            const status =
                order.status || "UNKNOWN";


            // ==================================
            // STATUS BADGE
            // ==================================

            const statusBadge =
                getStatusBadge(status);


            // ==================================
            // ACTION BUTTONS
            // ==================================

            const actionButtons =
                getActionButtons(order);


            // ==================================
            // CREATE ROW
            // ==================================

            const row = `
                <tr>

                    <td>
                        <strong>
                            #${orderId}
                        </strong>
                    </td>

                    <td>
                        ${buyerName}
                    </td>

                    <td>
                        ${productName}
                    </td>

                    <td>
                        ${quantity}
                    </td>

                    <td>
                        <strong>
                            ₹${totalPrice.toFixed(2)}
                        </strong>
                    </td>

                    <td>
                        ${statusBadge}
                    </td>

                    <td>
                        ${actionButtons}
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

    switch (status) {


        case "PENDING":

            return `
                <span
                    class="badge bg-warning text-dark"
                >
                    Pending
                </span>
            `;


        case "ACCEPTED":

            return `
                <span class="badge bg-success">
                    Accepted
                </span>
            `;


        case "REJECTED":

            return `
                <span class="badge bg-danger">
                    Rejected
                </span>
            `;


        case "COMPLETED":

            return `
                <span class="badge bg-primary">
                    Completed
                </span>
            `;


        default:

            return `
                <span class="badge bg-secondary">
                    ${status}
                </span>
            `;

    }

}


// ==========================================
// ACTION BUTTONS
// ==========================================

function getActionButtons(order) {


    // ======================================
    // ONLY PENDING
    // ======================================

    if (order.status === "PENDING") {

        return `

            <button
                class="btn btn-success btn-sm me-1"
                onclick="updateOrderStatus(
                    ${order.id},
                    'ACCEPTED'
                )"
            >
                Accept
            </button>


            <button
                class="btn btn-danger btn-sm"
                onclick="updateOrderStatus(
                    ${order.id},
                    'REJECTED'
                )"
            >
                Reject
            </button>

        `;

    }


    // ======================================
    // NO ACTION
    // ======================================

    return `
        <span class="text-muted">
            No action
        </span>
    `;

}


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

async function updateOrderStatus(
    orderId,
    newStatus
) {


    // ======================================
    // CONFIRM
    // ======================================

    const action =
        newStatus === "ACCEPTED"
            ? "accept"
            : "reject";


    const confirmed =
        confirm(
            `Are you sure you want to ${action} this order?`
        );


    if (!confirmed) {

        return;

    }


    try {


        // ==================================
        // CORRECT BACKEND URL
        // ==================================
        //
        // PUT
        // /api/orders/{orderId}/status
        //
        // ==================================

        const apiUrl =
            `${ORDER_API_URL}/${orderId}/status`;


        console.log(
            "Updating Order URL:",
            apiUrl
        );


        // ==================================
        // REQUEST BODY
        // ==================================

        const requestData = {

            farmerId:
                Number(userId),

            status:
                newStatus

        };


        console.log(
            "Request Data:",
            requestData
        );


        // ==================================
        // CALL API
        // ==================================

        const response =
            await fetch(
                apiUrl,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(requestData)

                }
            );


        console.log(
            "Update Response:",
            response.status
        );


        // ==================================
        // HANDLE ERROR
        // ==================================

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Update Error:",
                errorText
            );


            throw new Error(
                errorText ||
                `Failed to update order. Status: ${response.status}`
            );

        }


        // ==================================
        // SUCCESS RESPONSE
        // ==================================

        const updatedOrder =
            await response.json();


        console.log(
            "Updated Order:",
            updatedOrder
        );


        // ==================================
        // SUCCESS MESSAGE
        // ==================================

        if (newStatus === "ACCEPTED") {

            alert(
                "Order accepted successfully!"
            );

        }

        else {

            alert(
                "Order rejected successfully!"
            );

        }


        // ==================================
        // RELOAD ORDERS
        // ==================================

        await loadOrders();

    }

    catch (error) {

        console.error(
            "UPDATE ORDER ERROR:",
            error
        );


        alert(

            "Unable to update order status.\n\n" +
            error.message

        );

    }

}


// ==========================================
// FILTER ORDERS
// ==========================================

function filterOrders() {

    const searchInput =
        document.getElementById("searchInput");


    const statusFilter =
        document.getElementById("statusFilter");


    // ======================================
    // SEARCH VALUE
    // ======================================

    const searchValue =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    // ======================================
    // STATUS VALUE
    // ======================================

    const selectedStatus =
        statusFilter
            ? statusFilter.value
                .toUpperCase()
                .trim()
            : "ALL";


    // ======================================
    // FILTER
    // ======================================

    const filteredOrders =
        allOrders.filter(
            function (order) {


                const buyerName =
                    (
                        order.buyer?.fullName ||
                        order.buyer?.name ||
                        ""
                    )
                    .toLowerCase();


                const productName =
                    (
                        order.product?.name ||
                        ""
                    )
                    .toLowerCase();


                const orderId =
                    String(
                        order.id || ""
                    );


                // SEARCH

                const matchesSearch =

                    buyerName.includes(searchValue) ||

                    productName.includes(searchValue) ||

                    orderId.includes(searchValue);


                // STATUS

                const matchesStatus =

                    selectedStatus === "ALL" ||

                    order.status === selectedStatus;


                return (

                    matchesSearch &&
                    matchesStatus

                );

            }
        );


    // ======================================
    // DISPLAY
    // ======================================

    displayOrders(filteredOrders);

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {


    sessionStorage.clear();


    localStorage.removeItem("userId");

    localStorage.removeItem("fullName");

    localStorage.removeItem("userRole");


    window.location.href =
        "login.html";

}