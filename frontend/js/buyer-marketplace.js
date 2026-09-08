// ==========================================
// API URL
// ==========================================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products/available";


// ==========================================
// GET LOGIN INFORMATION
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

if (!userId || userRole !== "BUYER") {

    window.location.href = "login.html";

}


// ==========================================
// GLOBAL PRODUCTS
// ==========================================

let allProducts = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const buyerName =
            document.getElementById("buyerName");

        if (buyerName) {

            buyerName.textContent =
                fullName || "Buyer";

        }


        // Load marketplace products

        loadProducts();


        // Search

        const searchInput =
            document.getElementById("searchProduct");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterProducts
            );

        }


        // Category filter

        const categoryFilter =
            document.getElementById("categoryFilter");

        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                filterProducts
            );

        }


        // Logout

        const logoutButton =
            document.getElementById("logoutButton");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }

    }
);


// ==========================================
// LOAD ALL FARMERS' AVAILABLE PRODUCTS
// ==========================================

async function loadProducts() {

    const container =
        document.getElementById("productContainer");


    try {

        container.innerHTML = `

            <div class="col-12 text-center py-5">

                <div
                    class="spinner-border text-success"
                    role="status">

                </div>

                <p class="mt-3">
                    Loading products...
                </p>

            </div>

        `;


        console.log(
            "Loading products from:",
            PRODUCT_API_URL
        );


        const response =
            await fetch(PRODUCT_API_URL);


        if (!response.ok) {

            throw new Error(
                "Server returned status: " +
                response.status
            );

        }


        allProducts =
            await response.json();


        console.log(
            "All available products:",
            allProducts
        );


        displayProducts(allProducts);

    }

    catch (error) {

        console.error(
            "Marketplace Error:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger">

                    <h5>
                        Unable to load products
                    </h5>

                    <p class="mb-0">

                        Check that Spring Boot is running
                        and the API endpoint is available.

                    </p>

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
        document.getElementById("productContainer");


    container.innerHTML = "";


    // No products

    if (!products || products.length === 0) {

        container.innerHTML = `

            <div class="col-12 text-center py-5">

                <h4>
                    No products found 🌾
                </h4>

                <p class="text-muted">

                    There are currently no
                    available products.

                </p>

            </div>

        `;

        return;

    }


    // Display every product

    products.forEach(function (product) {

        const imageUrl =
            product.imageUrl &&
            product.imageUrl.trim() !== ""

                ? product.imageUrl

                : "../images/no-image.png";


        const productCard = `

            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">

                <div class="card h-100 shadow-sm">


                    <!-- PRODUCT IMAGE -->

                    <img

                        src="${imageUrl}"

                        class="card-img-top"

                        alt="${product.name || "Product"}"

                        style="
                            height: 200px;
                            object-fit: cover;
                        "

                        onerror="
                            this.onerror=null;
                            this.src='../images/no-image.png';
                        "

                    >


                    <!-- PRODUCT DETAILS -->

                    <div
                        class="card-body
                        d-flex
                        flex-column">


                        <h5 class="card-title">

                            ${product.name || "Unnamed Product"}

                        </h5>


                        <p class="text-muted mb-2">

                            🌱
                            ${product.category || "Other"}

                        </p>


                        <p>

                            <strong>

                                ₹${product.price ?? 0}

                            </strong>

                            / ${product.unit || "unit"}

                        </p>


                        <p>

                            Available:

                            <strong>

                                ${product.quantity ?? 0}
                                ${product.unit || ""}

                            </strong>

                        </p>


                        <button

                            class="
                                btn
                                btn-success
                                mt-auto
                            "

                            onclick="
                                viewProduct(${product.id})
                            "

                        >

                            <i class="bi bi-eye"></i>

                            View Product

                        </button>


                    </div>

                </div>

            </div>

        `;


        container.innerHTML += productCard;

    });

}


// ==========================================
// SEARCH AND FILTER
// ==========================================

function filterProducts() {

    const searchText =
        document
            .getElementById("searchProduct")
            .value
            .toLowerCase()
            .trim();


    const selectedCategory =
        document
            .getElementById("categoryFilter")
            .value;


    const filteredProducts =
        allProducts.filter(function (product) {

            const productName =
                (product.name || "")
                    .toLowerCase();


            const productCategory =
                (product.category || "")
                    .toLowerCase();


            // Search by name or category

            const matchesSearch =

                productName.includes(searchText)

                ||

                productCategory.includes(searchText);


            // Category filter

            const matchesCategory =

                selectedCategory === "All"

                ||

                product.category ===
                selectedCategory;


            return
                matchesSearch &&
                matchesCategory;

        });


    displayProducts(filteredProducts);

}


// ==========================================
// VIEW PRODUCT
// ==========================================

function viewProduct(productId) {

    window.location.href =
        "product-details.html?id=" + productId;

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