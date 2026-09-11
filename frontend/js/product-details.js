// ==========================================
// API URLs
// ==========================================

const PRODUCT_API_URL = "http://localhost:8080/api/products";
const ORDER_API_URL = "http://localhost:8080/api/orders";


// ==========================================
// GET PRODUCT ID FROM URL
// ==========================================

const urlParams = new URLSearchParams(window.location.search);

const productId = urlParams.get("id");


// ==========================================
// LOGGED-IN USER
// ==========================================

const buyerId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");

const userRole =
    sessionStorage.getItem("userRole") ||
    localStorage.getItem("userRole");


// ==========================================
// GLOBAL PRODUCT
// ==========================================

let currentProduct = null;


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // CHECK LOGIN
    // ==========================================

    if (!buyerId) {

        alert("Please login first.");

        window.location.href = "../index.html";

        return;

    }


    // ==========================================
    // CHECK USER ROLE
    // ==========================================

    if (userRole !== "BUYER") {

        alert("Only buyers can access this page.");

        window.location.href = "../index.html";

        return;

    }


    // ==========================================
    // CHECK PRODUCT ID
    // ==========================================

    if (!productId) {

        showError("Product ID was not provided.");

        return;

    }


    // ==========================================
    // LOAD PRODUCT DETAILS
    // ==========================================

    loadProductDetails();


    // ==========================================
    // QUANTITY BUTTON EVENTS
    // ==========================================

    const increaseButton =
        document.getElementById("increaseQuantity");

    const decreaseButton =
        document.getElementById("decreaseQuantity");

    const quantityInput =
        document.getElementById("orderQuantity");


    if (increaseButton) {

        increaseButton.addEventListener(
            "click",
            increaseQuantity
        );

    }


    if (decreaseButton) {

        decreaseButton.addEventListener(
            "click",
            decreaseQuantity
        );

    }


    if (quantityInput) {

        quantityInput.addEventListener(
            "change",
            validateQuantity
        );

        quantityInput.addEventListener(
            "input",
            validateQuantity
        );

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                logoutUser();

            }
        );

    }

});


// ==========================================
// LOAD PRODUCT DETAILS
// ==========================================

async function loadProductDetails() {

    try {

        console.log(
            "Loading Product ID:",
            productId
        );


        const response = await fetch(
            `${PRODUCT_API_URL}/${productId}`
        );


        // ==========================================
        // PRODUCT NOT FOUND
        // ==========================================

        if (response.status === 404) {

            showError("Product not found.");

            return;

        }


        // ==========================================
        // OTHER ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                "Failed to load product details."
            );

        }


        const product =
            await response.json();


        console.log(
            "Product Details:",
            product
        );


        currentProduct = product;


        displayProduct(product);

    }

    catch (error) {

        console.error(
            "Product Details Error:",
            error
        );


        showError(
            "Unable to load product details. " +
            "Make sure the Spring Boot server is running."
        );

    }

}


// ==========================================
// DISPLAY PRODUCT
// ==========================================

function displayProduct(product) {

    // ==========================================
    // HIDE LOADING
    // ==========================================

    document
        .getElementById("loadingContainer")
        .classList.add("d-none");


    // ==========================================
    // SHOW PRODUCT
    // ==========================================

    document
        .getElementById("productDetails")
        .classList.remove("d-none");


    // ==========================================
    // PRODUCT IMAGE
    // ==========================================

    const productImage =
        document.getElementById("productImage");


    if (
        product.imageUrl &&
        product.imageUrl.trim() !== ""
    ) {

        productImage.src = product.imageUrl;

    }

    else {

        productImage.src =
            "../images/no-image.png";

    }


    // Image fallback

    productImage.onerror = function () {

        this.onerror = null;

        this.src =
            "../images/no-image.png";

    };


    // ==========================================
    // PRODUCT NAME
    // ==========================================

    document
        .getElementById("productName")
        .textContent =
            product.name ||
            "Unnamed Product";


    // ==========================================
    // PRODUCT STATUS
    // ==========================================

    const status =
        product.availability ||
        "Unavailable";


    const statusElement =
        document.getElementById("productStatus");


    statusElement.textContent = status;


    if (
        status.toLowerCase() === "available"
    ) {

        statusElement.className =
            "badge bg-success mb-3";

    }

    else {

        statusElement.className =
            "badge bg-danger mb-3";

    }


    // ==========================================
    // PRODUCT PRICE
    // ==========================================

    document
        .getElementById("productPrice")
        .textContent =
            `₹${product.price ?? 0} / ${product.unit || ""}`;


    // ==========================================
    // CATEGORY
    // ==========================================

    document
        .getElementById("productCategory")
        .textContent =
            product.category || "-";


    // ==========================================
    // AVAILABLE QUANTITY
    // ==========================================

    document
        .getElementById("productQuantity")
        .textContent =
            `${product.quantity ?? 0} ${product.unit || ""}`;


    // ==========================================
    // SET MAXIMUM ORDER QUANTITY
    // ==========================================

    const quantityInput =
        document.getElementById("orderQuantity");


    const availableQuantity =
        Number(product.quantity) || 0;


    quantityInput.max = availableQuantity;


    if (availableQuantity > 0) {

        quantityInput.value = 1;

    }

    else {

        quantityInput.value = 0;

        quantityInput.disabled = true;

    }


    // ==========================================
    // HARVEST DATE
    // ==========================================

    document
        .getElementById("productHarvestDate")
        .textContent =
            formatDate(product.harvestDate);


    // ==========================================
    // LOCATION
    // ==========================================

    document
        .getElementById("productLocation")
        .textContent =
            product.location || "-";


    // ==========================================
    // FARMER NAME
    // ==========================================

    document
        .getElementById("farmerName")
        .textContent =

            product.farmer &&
            product.farmer.fullName

                ? product.farmer.fullName

                : "Farmer";


    // ==========================================
    // DESCRIPTION
    // ==========================================

    document
        .getElementById("productDescription")
        .textContent =
            product.description ||
            "No description available.";


    // ==========================================
    // BUY NOW BUTTON
    // ==========================================

    const buyButton =
        document.getElementById("buyNowButton");


    buyButton.onclick = buyProduct;


    // ==========================================
    // CONTACT FARMER BUTTON
    // ==========================================

    document
        .getElementById("contactFarmerButton")
        .onclick = function () {

            contactFarmer(product);

        };


    // ==========================================
    // DISABLE BUY BUTTON
    // ==========================================

    if (
        status.toLowerCase() !== "available" ||
        availableQuantity <= 0
    ) {

        buyButton.disabled = true;

        buyButton.innerHTML =
            '<i class="bi bi-x-circle"></i> Unavailable';

    }

}


// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity() {

    if (!currentProduct) {

        return;

    }


    const input =
        document.getElementById("orderQuantity");


    let quantity =
        Number(input.value);


    const availableQuantity =
        Number(currentProduct.quantity);


    if (quantity < availableQuantity) {

        input.value = quantity + 1;

    }

    else {

        alert(
            `Only ${availableQuantity} ${currentProduct.unit} available.`
        );

    }

}


// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity() {

    const input =
        document.getElementById("orderQuantity");


    let quantity =
        Number(input.value);


    if (quantity > 1) {

        input.value = quantity - 1;

    }

}


// ==========================================
// VALIDATE QUANTITY
// ==========================================

function validateQuantity() {

    if (!currentProduct) {

        return;

    }


    const input =
        document.getElementById("orderQuantity");


    let quantity =
        Number(input.value);


    const maximum =
        Number(currentProduct.quantity);


    // ==========================================
    // MINIMUM QUANTITY
    // ==========================================

    if (
        !quantity ||
        quantity < 1
    ) {

        input.value = 1;

        return;

    }


    // ==========================================
    // MAXIMUM QUANTITY
    // ==========================================

    if (quantity > maximum) {

        input.value = maximum;


        alert(
            `Maximum available quantity is ${maximum} ${currentProduct.unit}.`
        );

    }

}


// ==========================================
// BUY PRODUCT
// ==========================================

async function buyProduct() {

    // ==========================================
    // CHECK PRODUCT
    // ==========================================

    if (!currentProduct) {

        alert(
            "Product information is not loaded."
        );

        return;

    }


    // ==========================================
    // GET QUANTITY
    // ==========================================

    const quantity =
        Number(
            document
                .getElementById("orderQuantity")
                .value
        );


    // ==========================================
    // VALIDATE QUANTITY
    // ==========================================

    if (
        !quantity ||
        quantity <= 0
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    if (
        quantity >
        Number(currentProduct.quantity)
    ) {

        alert(
            "Requested quantity is greater than available stock."
        );

        return;

    }


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const totalPrice =
        Number(currentProduct.price) *
        quantity;


    // ==========================================
    // CONFIRM ORDER
    // ==========================================

    const confirmOrder = confirm(

        `Confirm your order?\n\n` +

        `Product: ${currentProduct.name}\n` +

        `Quantity: ${quantity} ${currentProduct.unit}\n` +

        `Price per unit: ₹${currentProduct.price}\n` +

        `Total Price: ₹${totalPrice}`

    );


    if (!confirmOrder) {

        return;

    }


    // ==========================================
    // ORDER DATA
    // ==========================================

    const orderData = {

        productId:
            Number(currentProduct.id),

        buyerId:
            Number(buyerId),

        quantity:
            quantity

    };


    console.log(
        "Sending Order:",
        orderData
    );


    const buyButton =
        document.getElementById("buyNowButton");


    try {

        // ==========================================
        // DISABLE BUTTON
        // ==========================================

        buyButton.disabled = true;


        buyButton.innerHTML =
            `
            <span
                class="spinner-border spinner-border-sm"
            ></span>
            Processing...
            `;


        // ==========================================
        // CALL ORDER API
        // ==========================================

        const response = await fetch(

            ORDER_API_URL,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(orderData)

            }

        );


        // ==========================================
        // READ RESPONSE SAFELY
        // ==========================================

        let result = null;


        try {

            result =
                await response.json();

        }

        catch (error) {

            console.error(
                "Unable to parse response:",
                error
            );

        }


        console.log(
            "Order Response:",
            result
        );


        // ==========================================
        // ERROR RESPONSE
        // ==========================================

        if (!response.ok) {

            alert(

                result?.message ||

                result?.error ||

                "Unable to place the order."

            );

            return;

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(

            "🎉 Order placed successfully!\n\n" +

            `Order ID: ${result?.id || "Created"}\n` +

            `Total Amount: ₹${result?.totalPrice ?? totalPrice}`

        );


        // ==========================================
        // REDIRECT TO MY ORDERS
        // ==========================================

        window.location.href =
            "buyer-orders.html";

    }

    catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(
            "Unable to connect to the server. " +
            "Make sure Spring Boot is running."
        );

    }

    finally {

        // Restore button only if still on page

        if (
            document.body.contains(buyButton) &&
            !buyButton.disabled
        ) {

            buyButton.innerHTML =
                `
                <i class="bi bi-cart-fill"></i>
                Buy Now
                `;

        }

    }

}


// ==========================================
// CONTACT FARMER
// ==========================================

function contactFarmer(product) {

    if (
        product.farmer &&
        product.farmer.mobile
    ) {

        alert(
            "Farmer Mobile Number: " +
            product.farmer.mobile
        );

    }

    else {

        alert(
            "Farmer contact information is not available."
        );

    }

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "Not specified";

    }


    const date =
        new Date(dateValue);


    // Invalid date

    if (isNaN(date.getTime())) {

        return "Not specified";

    }


    return date.toLocaleDateString(

        "en-IN",

        {

            day: "numeric",

            month: "long",

            year: "numeric"

        }

    );

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    sessionStorage.clear();


    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");


    window.location.href =
        "../index.html";

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    const loadingContainer =
        document.getElementById("loadingContainer");


    if (loadingContainer) {

        loadingContainer.classList.add("d-none");

    }


    const errorContainer =
        document.getElementById("errorContainer");


    errorContainer.classList.remove("d-none");


    errorContainer.innerHTML = `

        <div class="alert alert-danger text-center">

            <h5>

                <i class="bi bi-exclamation-triangle"></i>

                Error

            </h5>

            <p>${message}</p>


            <a
                href="browse-products.html"
                class="btn btn-secondary"
            >

                <i class="bi bi-arrow-left"></i>

                Back to Browse Products

            </a>

        </div>

    `;

}