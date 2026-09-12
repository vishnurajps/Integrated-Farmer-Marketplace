// ==========================================
// BROWSE PRODUCTS.JS
// ==========================================

console.log("BROWSE PRODUCTS.JS LOADED");


// ==========================================
// API URL
// ==========================================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products/available";


// ==========================================
// LOGIN INFORMATION
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
// PRODUCT DATA
// ==========================================

let allProducts = [];


// ==========================================
// CHECK LOGIN
// ==========================================

if (!userId || userRole !== "BUYER") {

    alert("Please login as a buyer.");

    window.location.href =
        "login.html";

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("Buyer ID:", userId);
        console.log("User Role:", userRole);


        // ==================================
        // DISPLAY USER NAME
        // ==================================

        displayUserName();


        // ==================================
        // LOAD PRODUCTS
        // ==================================

        loadProducts();


        // ==================================
        // SETUP SEARCH
        // ==================================

        setupSearch();


        // ==================================
        // SETUP CATEGORY FILTER
        // ==================================

        setupCategoryFilter();


        // ==================================
        // SETUP CLEAR FILTERS
        // ==================================

        setupClearFilters();


        // ==================================
        // SETUP LOGOUT
        // ==================================

        setupLogout();


        // ==================================
        // SETUP SIDEBAR LOGOUT
        // ==================================

        setupSidebarLogout();


        // ==================================
        // UPDATE CART BADGE
        // ==================================

        updateCartBadge();


        // ==================================
        // AUTO REFRESH PRODUCTS
        // ==================================

        // Refresh every 10 seconds so that
        // quantity changes after farmer accepts
        // an order are reflected automatically.

        setInterval(
            function () {

                console.log(
                    "Refreshing marketplace products..."
                );

                refreshProducts();

            },
            10000
        );

    }
);


// ==========================================
// DISPLAY USER NAME
// ==========================================

function displayUserName() {

    const userName =
        document.getElementById("userName");


    if (userName) {

        userName.textContent =
            fullName || "Buyer";

    }

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    const container =
        document.getElementById(
            "productContainer"
        );


    if (!container) {

        console.error(
            "productContainer not found"
        );

        return;

    }


    // ======================================
    // SHOW LOADING
    // ======================================

    container.innerHTML = `

        <div class="col-12 text-center py-5">

            <div
                class="spinner-border text-success"
                role="status"
            ></div>

            <p class="text-muted mt-3">

                Loading products...

            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                PRODUCT_API_URL,
                {
                    cache: "no-store"
                }
            );


        console.log(
            "Product API Response:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load products. Status: " +
                response.status
            );

        }


        const products =
            await response.json();


        console.log(
            "Marketplace Products:",
            products
        );


        // ======================================
        // SAVE PRODUCTS
        // ======================================

        allProducts =
            Array.isArray(products)
                ? products
                : [];


        // ======================================
        // UPDATE CART QUANTITY DATA
        // ======================================

        updateCartProductAvailability();


        // ======================================
        // DISPLAY PRODUCTS
        // ======================================

        applyFilters();

    }

    catch (error) {

        console.error(
            "Product Loading Error:",
            error
        );


        container.innerHTML = `

            <div class="col-12 text-center">

                <div class="alert alert-danger">

                    <strong>
                        Unable to load products.
                    </strong>

                    <br>

                    <small>
                        ${error.message}
                    </small>

                </div>

            </div>

        `;

    }

}


// ==========================================
// REFRESH PRODUCTS
// ==========================================

async function refreshProducts() {

    try {

        const response =
            await fetch(
                PRODUCT_API_URL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to refresh products"
            );

        }


        const products =
            await response.json();


        allProducts =
            Array.isArray(products)
                ? products
                : [];


        // ======================================
        // UPDATE CART STOCK INFORMATION
        // ======================================

        updateCartProductAvailability();


        // ======================================
        // APPLY CURRENT FILTERS
        // ======================================

        applyFilters();


        console.log(
            "Products refreshed successfully"
        );

    }

    catch (error) {

        console.error(
            "Product refresh error:",
            error
        );

    }

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

    const container =
        document.getElementById(
            "productContainer"
        );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


    if (!container) {

        return;

    }


    // ======================================
    // CLEAR CONTAINER
    // ======================================

    container.innerHTML = "";


    // ======================================
    // UPDATE RESULT COUNT
    // ======================================

    if (resultCount) {

        resultCount.textContent =
            products.length;

    }


    // ======================================
    // NO PRODUCTS
    // ======================================

    if (!products || products.length === 0) {

        container.innerHTML = `

            <div class="col-12 text-center">

                <div class="alert alert-info">

                    No products available.

                </div>

            </div>

        `;

        return;

    }


    // ======================================
    // DISPLAY PRODUCTS
    // ======================================

    products.forEach(
        function (product) {

            // ==================================
            // IMAGE
            // ==================================

            let imageUrl =
                product.imageUrl;


            if (
                !imageUrl ||
                imageUrl.trim() === ""
            ) {

                imageUrl =
                    "../images/no-image.png";

            }


            // ==================================
            // FARMER NAME
            // ==================================

            const farmerName =
                product.farmer &&
                product.farmer.fullName
                    ? product.farmer.fullName
                    : "Farmer";


            // ==================================
            // QUANTITY
            // ==================================

            const quantity =
                Number(
                    product.quantity ?? 0
                );


            const unit =
                product.unit || "";


            // ==================================
            // PRODUCT AVAILABLE
            // ==================================

            const isAvailable =
                quantity > 0 &&
                product.availability &&
                product.availability
                    .toLowerCase() === "available";


            // ==================================
            // BUTTON
            // ==================================

            const addButton = isAvailable

                ? `

                    <button
                        class="btn btn-success w-50"
                        onclick="addToCart(${product.id})"
                    >

                        <i class="bi bi-cart-plus"></i>

                        Add

                    </button>

                `

                : `

                    <button
                        class="btn btn-secondary w-50"
                        disabled
                    >

                        Out of Stock

                    </button>

                `;


            // ==================================
            // PRODUCT CARD
            // ==================================

            const card = `

                <div class="col-lg-4 col-md-6 mb-4">

                    <div
                        class="card h-100 shadow-sm"
                    >


                        <!-- PRODUCT IMAGE -->

                        <img
                            src="${imageUrl}"

                            class="card-img-top"

                            alt="${product.name || "Product"}"

                            style="
                                height: 220px;
                                object-fit: cover;
                            "

                            onerror="
                                this.src='../images/no-image.png'
                            "
                        >


                        <div
                            class="card-body d-flex flex-column"
                        >


                            <!-- PRODUCT NAME -->

                            <h5 class="card-title">

                                ${product.name || "Product"}

                            </h5>


                            <!-- CATEGORY -->

                            <p class="text-muted mb-2">

                                <i class="bi bi-tag"></i>

                                ${product.category || "-"}

                            </p>


                            <!-- FARMER -->

                            <p class="mb-2">

                                <i class="bi bi-person"></i>

                                Farmer:

                                <strong>

                                    ${farmerName}

                                </strong>

                            </p>


                            <!-- AVAILABLE QUANTITY -->

                            <p class="mb-2">

                                <i class="bi bi-box"></i>

                                Available:

                                <strong>

                                    ${quantity} ${unit}

                                </strong>

                            </p>


                            <!-- LOCATION -->

                            <p class="mb-2">

                                <i class="bi bi-geo-alt"></i>

                                ${product.location ||
                                    "Location not specified"}

                            </p>


                            <!-- PRICE -->

                            <h4 class="text-success mt-auto">

                                ₹${product.price ?? "-"}

                                <small class="text-muted">

                                    /${unit || "unit"}

                                </small>

                            </h4>


                            <!-- AVAILABILITY -->

                            <p class="mb-2">

                                ${isAvailable

                                    ? `

                                        <span
                                            class="badge bg-success"
                                        >

                                            Available

                                        </span>

                                    `

                                    : `

                                        <span
                                            class="badge bg-danger"
                                        >

                                            Out of Stock

                                        </span>

                                    `
                                }

                            </p>


                            <!-- BUTTONS -->

                            <div
                                class="d-flex gap-2 mt-3"
                            >


                                <button
                                    class="btn btn-outline-success w-50"
                                    onclick="viewProduct(${product.id})"
                                >

                                    View

                                </button>


                                ${addButton}


                            </div>


                        </div>

                    </div>

                </div>

            `;


            container.innerHTML += card;

        }

    );

}


// ==========================================
// SEARCH SETUP
// ==========================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchProduct"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


// ==========================================
// CATEGORY FILTER SETUP
// ==========================================

function setupCategoryFilter() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (!categoryFilter) {

        return;

    }


    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const searchInput =
        document.getElementById(
            "searchProduct"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "All";


    const filteredProducts =
        allProducts.filter(
            function (product) {

                const productName =
                    (product.name || "")
                        .toLowerCase();


                const category =
                    product.category || "";


                const matchesSearch =
                    productName.includes(
                        searchText
                    );


                const matchesCategory =

                    selectedCategory === "All" ||

                    category === selectedCategory;


                return (

                    matchesSearch &&
                    matchesCategory

                );

            }
        );


    displayProducts(
        filteredProducts
    );

}


// ==========================================
// CLEAR FILTERS
// ==========================================

function setupClearFilters() {

    const clearButton =
        document.getElementById(
            "clearFilters"
        );


    if (!clearButton) {

        return;

    }


    clearButton.addEventListener(
        "click",
        function () {

            const searchInput =
                document.getElementById(
                    "searchProduct"
                );


            const categoryFilter =
                document.getElementById(
                    "categoryFilter"
                );


            if (searchInput) {

                searchInput.value = "";

            }


            if (categoryFilter) {

                categoryFilter.value = "All";

            }


            applyFilters();

        }
    );

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    // ======================================
    // FIND LATEST PRODUCT
    // ======================================

    const product =
        allProducts.find(
            product =>
                product.id === productId
        );


    if (!product) {

        alert("Product not found.");

        return;

    }


    // ======================================
    // CHECK CURRENT STOCK
    // ======================================

    const availableQuantity =
        Number(product.quantity ?? 0);


    if (availableQuantity <= 0) {

        alert(
            "This product is out of stock."
        );

        return;

    }


    // ======================================
    // GET CART
    // ======================================

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    // ======================================
    // FIND EXISTING PRODUCT
    // ======================================

    const existingProduct =
        cart.find(
            item =>
                item.id === productId
        );


    // ======================================
    // PRODUCT ALREADY IN CART
    // ======================================

    if (existingProduct) {

        const currentCartQuantity =
            Number(
                existingProduct.cartQuantity ?? 0
            );


        // ==================================
        // CHECK LATEST STOCK
        // ==================================

        if (
            currentCartQuantity + 1 >
            availableQuantity
        ) {

            alert(
                "Cannot add more than available stock.\n\n" +
                "Available: " +
                availableQuantity +
                " " +
                (product.unit || "")
            );

            return;

        }


        existingProduct.cartQuantity =
            currentCartQuantity + 1;


        // ==================================
        // UPDATE LATEST STOCK
        // ==================================

        existingProduct.availableQuantity =
            availableQuantity;

    }

    else {

        // ==================================
        // ADD NEW PRODUCT
        // ==================================

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            unit: product.unit,

            imageUrl: product.imageUrl,

            availableQuantity:
                availableQuantity,

            cartQuantity: 1

        });

    }


    // ======================================
    // SAVE CART
    // ======================================

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // ======================================
    // UPDATE BADGE
    // ======================================

    updateCartBadge();


    alert(
        product.name +
        " added to cart!"
    );

}


// ==========================================
// UPDATE CART PRODUCT AVAILABILITY
// ==========================================

function updateCartProductAvailability() {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let cartChanged = false;


    // ======================================
    // UPDATE CART USING LATEST PRODUCT STOCK
    // ======================================

    cart.forEach(
        function (cartItem) {

            const latestProduct =
                allProducts.find(
                    product =>
                        product.id === cartItem.id
                );


            if (latestProduct) {

                const latestQuantity =
                    Number(
                        latestProduct.quantity ?? 0
                    );


                // Update available quantity

                if (
                    cartItem.availableQuantity !==
                    latestQuantity
                ) {

                    cartItem.availableQuantity =
                        latestQuantity;

                    cartChanged = true;

                }


                // ==================================
                // IF CART QUANTITY IS GREATER
                // THAN AVAILABLE STOCK
                // ==================================

                if (
                    cartItem.cartQuantity >
                    latestQuantity
                ) {

                    cartItem.cartQuantity =
                        Math.max(
                            0,
                            latestQuantity
                        );

                    cartChanged = true;

                }

            }

            else {

                // Product is no longer available

                cartItem.availableQuantity = 0;

                cartChanged = true;

            }

        }
    );


    // ======================================
    // REMOVE ZERO QUANTITY ITEMS
    // ======================================

    cart =
        cart.filter(
            item =>
                item.cartQuantity > 0
        );


    // ======================================
    // SAVE UPDATED CART
    // ======================================

    if (cartChanged) {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }


    updateCartBadge();

}


// ==========================================
// UPDATE CART BADGE
// ==========================================

function updateCartBadge() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const badge =
        document.getElementById(
            "cartBadge"
        );


    if (!badge) {

        return;

    }


    let totalItems = 0;


    cart.forEach(
        function (item) {

            totalItems +=
                Number(
                    item.cartQuantity ?? 0
                );

        }
    );


    badge.textContent =
        totalItems;

}


// ==========================================
// VIEW PRODUCT
// ==========================================

function viewProduct(productId) {

    window.location.href =
        `product-details.html?id=${productId}`;

}


// ==========================================
// NAVBAR LOGOUT
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

            logout();

        }
    );

}


// ==========================================
// SIDEBAR LOGOUT
// ==========================================

function setupSidebarLogout() {

    const sidebarLogout =
        document.getElementById(
            "sidebarLogoutButton"
        );


    if (!sidebarLogout) {

        return;

    }


    sidebarLogout.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {

        return;

    }


    // ======================================
    // CLEAR SESSION
    // ======================================

    sessionStorage.clear();


    // ======================================
    // CLEAR LOGIN DATA
    // ======================================

    localStorage.removeItem("userId");

    localStorage.removeItem("fullName");

    localStorage.removeItem("userRole");


    // ======================================
    // REDIRECT
    // ======================================

    window.location.href =
        "login.html";

}