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
// CHECK LOGIN
// ==========================================

if (!userId || userRole !== "BUYER") {

    window.location.href = "login.html";

}


// ==========================================
// PRODUCT DATA
// ==========================================

let allProducts = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayUserName();

        loadProducts();

        setupSearch();

        setupCategoryFilter();

        setupClearFilters();

        setupLogout();

        updateCartBadge();

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


    try {

        const response =
            await fetch(PRODUCT_API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        allProducts =
            await response.json();


        console.log(
            "Marketplace Products:",
            allProducts
        );


        displayProducts(allProducts);

    }

    catch (error) {

        console.error(
            "Product Loading Error:",
            error
        );


        container.innerHTML = `

            <div class="col-12 text-center">

                <div class="alert alert-danger">

                    Unable to load products.

                    Make sure Spring Boot is running.

                </div>

            </div>

        `;

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


    container.innerHTML = "";


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

                    No products found.

                </div>

            </div>

        `;

        return;

    }


    // ======================================
    // PRODUCT CARDS
    // ======================================

    products.forEach(
        function (product) {

            let imageUrl =
                product.imageUrl;


            if (
                !imageUrl ||
                imageUrl.trim() === ""
            ) {

                imageUrl =
                    "../images/no-image.png";

            }


            const farmerName =
                product.farmer &&
                product.farmer.fullName
                    ? product.farmer.fullName
                    : "Farmer";


            const card = `

                <div class="col-lg-4 col-md-6 mb-4">

                    <div
                        class="card h-100 shadow-sm">


                        <!-- PRODUCT IMAGE -->

                        <img
                            src="${imageUrl}"
                            class="card-img-top"
                            alt="${product.name}"

                            style="
                                height: 220px;
                                object-fit: cover;
                            "

                            onerror="
                                this.src='../images/no-image.png'
                            "
                        >


                        <div class="card-body d-flex flex-column">


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


                            <!-- QUANTITY -->

                            <p class="mb-2">

                                <i class="bi bi-box"></i>

                                Available:

                                ${product.quantity ?? "-"}

                                ${product.unit || ""}

                            </p>


                            <!-- LOCATION -->

                            <p class="mb-2">

                                <i class="bi bi-geo-alt"></i>

                                ${product.location || "Location not specified"}

                            </p>


                            <!-- PRICE -->

                            <h4 class="text-success mt-auto">

                                ₹${product.price ?? "-"}

                                <small class="text-muted">

                                    /${product.unit || "unit"}

                                </small>

                            </h4>


                            <!-- BUTTONS -->

                            <div class="d-flex gap-2 mt-3">


                                <button
                                    class="btn btn-outline-success w-50"
                                    onclick="viewProduct(${product.id})">

                                    View

                                </button>


                                <button
                                    class="btn btn-success w-50"
                                    onclick="addToCart(${product.id})">

                                    <i class="bi bi-cart-plus"></i>

                                    Add

                                </button>


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
// SEARCH
// ==========================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchProduct"
        );


    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


// ==========================================
// CATEGORY FILTER
// ==========================================

function setupCategoryFilter() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const searchText =
        document.getElementById(
            "searchProduct"
        )
        .value
        .toLowerCase()
        .trim();


    const selectedCategory =
        document.getElementById(
            "categoryFilter"
        )
        .value;


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


    displayProducts(filteredProducts);

}


// ==========================================
// CLEAR FILTERS
// ==========================================

function setupClearFilters() {

    const clearButton =
        document.getElementById(
            "clearFilters"
        );


    clearButton.addEventListener(
        "click",
        function () {

            document.getElementById(
                "searchProduct"
            ).value = "";


            document.getElementById(
                "categoryFilter"
            ).value = "All";


            displayProducts(allProducts);

        }
    );

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    const product =
        allProducts.find(
            product =>
                product.id === productId
        );


    if (!product) {

        alert("Product not found");

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
    // CHECK EXISTING PRODUCT
    // ======================================

    const existingProduct =
        cart.find(
            item =>
                item.id === productId
        );


    if (existingProduct) {

        existingProduct.cartQuantity += 1;

    }

    else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            unit: product.unit,

            imageUrl: product.imageUrl,

            availableQuantity:
                product.quantity,

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


    updateCartBadge();


    alert(
        product.name +
        " added to cart!"
    );

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
                item.cartQuantity || 1;

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


            sessionStorage.clear();


            localStorage.removeItem("userId");

            localStorage.removeItem("fullName");

            localStorage.removeItem("userRole");


            window.location.href =
                "login.html";

        }
    );

}