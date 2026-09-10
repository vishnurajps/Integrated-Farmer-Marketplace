// ==========================================
// API URLs
// ==========================================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products";

const ORDER_API_URL =
    "http://localhost:8080/api/orders";


// ==========================================
// GET PRODUCT ID FROM URL
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const productId =
    urlParams.get("id");


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

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ==========================
        // CHECK LOGIN
        // ==========================

        if (!buyerId) {

            alert("Please login first.");

            window.location.href =
                "login.html";

            return;

        }


        // ==========================
        // CHECK BUYER ROLE
        // ==========================

        if (userRole !== "BUYER") {

            alert(
                "Only buyers can place orders."
            );

            window.location.href =
                "login.html";

            return;

        }


        // ==========================
        // CHECK PRODUCT ID
        // ==========================

        if (!productId) {

            showError(
                "Product ID was not provided."
            );

            return;

        }


        // ==========================
        // LOAD PRODUCT
        // ==========================

        loadProductDetails();


        // ==========================
        // QUANTITY BUTTON EVENTS
        // ==========================

        document
            .getElementById("increaseQuantity")
            .addEventListener(
                "click",
                increaseQuantity
            );


        document
            .getElementById("decreaseQuantity")
            .addEventListener(
                "click",
                decreaseQuantity
            );


        document
            .getElementById("orderQuantity")
            .addEventListener(
                "change",
                validateQuantity
            );

    }
);


// ==========================================
// LOAD PRODUCT DETAILS
// ==========================================

async function loadProductDetails() {

    try {

        console.log(
            "Loading Product ID:",
            productId
        );


        const response =
            await fetch(
                `${PRODUCT_API_URL}/${productId}`
            );


        // Product not found

        if (response.status === 404) {

            showError(
                "Product not found."
            );

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load product."
            );

        }


        const product =
            await response.json();


        console.log(
            "Product Details:",
            product
        );


        currentProduct =
            product;


        displayProduct(product);

    }

    catch (error) {

        console.error(
            "Product Details Error:",
            error
        );


        showError(
            "Unable to load product details. " +
            "Make sure Spring Boot is running."
        );

    }

}


// ==========================================
// DISPLAY PRODUCT
// ==========================================

function displayProduct(product) {

    // Hide loading

    document
        .getElementById("loadingContainer")
        .classList.add("d-none");


    // Show product

    document
        .getElementById("productDetails")
        .classList.remove("d-none");


    // ==========================================
    // PRODUCT IMAGE
    // ==========================================

    const productImage =
        document.getElementById(
            "productImage"
        );


    if (
        product.imageUrl &&
        product.imageUrl.trim() !== ""
    ) {

        productImage.src =
            product.imageUrl;

    }

    else {

        productImage.src =
            "../images/no-image.png";

    }


    // Image fallback

    productImage.onerror =
        function () {

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
    // STATUS
    // ==========================================

    const status =
        product.availability ||
        "Unavailable";


    const statusElement =
        document.getElementById(
            "productStatus"
        );


    statusElement.textContent =
        status;


    if (
        status.toLowerCase() ===
        "available"
    ) {

        statusElement.className =
            "badge bg-success mb-3";

    }

    else {

        statusElement.className =
            "badge bg-danger mb-3";

    }


    // ==========================================
    // PRICE
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
    // QUANTITY
    // ==========================================

    document
        .getElementById("productQuantity")
        .textContent =
            `${product.quantity ?? 0} ${product.unit || ""}`;


    // ==========================================
    // SET MAXIMUM ORDER QUANTITY
    // ==========================================

    const quantityInput =
        document.getElementById(
            "orderQuantity"
        );


    quantityInput.max =
        product.quantity || 1;


    quantityInput.value = 1;


    // ==========================================
    // HARVEST DATE
    // ==========================================

    document
        .getElementById("productHarvestDate")
        .textContent =
            formatDate(
                product.harvestDate
            );


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

    document
        .getElementById("buyNowButton")
        .onclick =
            function () {

                buyProduct();

            };


    // ==========================================
    // CONTACT FARMER BUTTON
    // ==========================================

    document
        .getElementById("contactFarmerButton")
        .onclick =
            function () {

                contactFarmer(product);

            };


    // ==========================================
    // DISABLE BUY BUTTON IF UNAVAILABLE
    // ==========================================

    if (
        status.toLowerCase() !== "available" ||
        !product.quantity ||
        product.quantity <= 0
    ) {

        document
            .getElementById("buyNowButton")
            .disabled = true;

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
        document.getElementById(
            "orderQuantity"
        );


    let quantity =
        Number(input.value);


    const availableQuantity =
        Number(
            currentProduct.quantity
        );


    if (
        quantity < availableQuantity
    ) {

        input.value =
            quantity + 1;

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
        document.getElementById(
            "orderQuantity"
        );


    let quantity =
        Number(input.value);


    if (quantity > 1) {

        input.value =
            quantity - 1;

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
        document.getElementById(
            "orderQuantity"
        );


    let quantity =
        Number(input.value);


    const maximum =
        Number(
            currentProduct.quantity
        );


    // Minimum quantity

    if (
        !quantity ||
        quantity < 1
    ) {

        input.value = 1;

        return;

    }


    // Maximum quantity

    if (
        quantity > maximum
    ) {

        input.value =
            maximum;


        alert(
            `Maximum available quantity is ${maximum} ${currentProduct.unit}`
        );

    }

}


// ==========================================
// BUY PRODUCT
// ==========================================

async function buyProduct() {

    if (!currentProduct) {

        alert(
            "Product information is not loaded."
        );

        return;

    }


    const quantity =
        Number(
            document
                .getElementById(
                    "orderQuantity"
                )
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
        currentProduct.quantity
    ) {

        alert(
            "Requested quantity is greater than available stock."
        );

        return;

    }


    // ==========================================
    // CONFIRM ORDER
    // ==========================================

    const totalPrice =
        currentProduct.price *
        quantity;


    const confirmOrder =
        confirm(

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
        document.getElementById(
            "buyNowButton"
        );


    try {

        // Disable button

        buyButton.disabled = true;

        buyButton.innerHTML =
            `<span class="spinner-border spinner-border-sm"></span>
             Processing...`;


        // ==========================================
        // CALL ORDER API
        // ==========================================

        const response =
            await fetch(
                ORDER_API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            );


        const result =
            await response.json();


        console.log(
            "Order Response:",
            result
        );


        // ==========================================
        // ERROR
        // ==========================================

        if (!response.ok) {

            alert(

                result.message ||

                result.error ||

                "Unable to place order."

            );

            return;

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(

            "🎉 Order placed successfully!\n\n" +

            `Order ID: ${result.id}\n` +

            `Total Amount: ₹${result.totalPrice}`

        );


        // Redirect to buyer orders

        window.location.href =
            "buyer-orders.html";


    }

    catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

    finally {

        buyButton.disabled = false;

        buyButton.innerHTML = `

            <i class="bi bi-cart-fill"></i>

            Buy Now

        `;

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
// BACK
// ==========================================

function goBack() {

    window.location.href =
        "buyer-marketplace.html";

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    document
        .getElementById("loadingContainer")
        .classList.add("d-none");


    const errorContainer =
        document.getElementById(
            "errorContainer"
        );


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

            <a
                href="buyer-marketplace.html"
                class="btn btn-secondary"
            >
                Back to Marketplace
            </a>

        </div>

    `;

}