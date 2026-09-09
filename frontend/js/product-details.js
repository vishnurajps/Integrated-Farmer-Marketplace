// ==========================================
// API URL
// ==========================================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products";


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
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Check product ID

        if (!productId) {

            showError(
                "Product ID was not provided."
            );

            return;

        }


        // Load product

        loadProductDetails();

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
            product.name || "Unnamed Product";


    // ==========================================
    // STATUS
    // ==========================================

    const status =
        product.availability || "Unavailable";


    const statusElement =
        document.getElementById(
            "productStatus"
        );


    statusElement.textContent =
        status;


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

                buyProduct(product);

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
// BUY PRODUCT
// ==========================================

function buyProduct(product) {

    // Next step:
    // Order system will be connected here

    alert(
        "Order functionality will be added next.\n\n" +
        "Product: " + product.name
    );

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

    // Hide loading

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