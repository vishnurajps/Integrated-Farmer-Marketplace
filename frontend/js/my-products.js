// ============================
// API URL
// ============================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products";


// ============================
// GET LOGGED-IN USER
// ============================

const userId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");


const userRole =
    sessionStorage.getItem("userRole") ||
    localStorage.getItem("userRole");


// ============================
// CHECK LOGIN
// ============================

if (!userId) {

    window.location.href =
        "login.html";

}


// ============================
// CHECK FARMER ROLE
// ============================

if (userRole !== "FARMER") {

    window.location.href =
        "login.html";

}


// ============================
// STORE PRODUCTS
// ============================

let allProducts = [];


// ============================
// PAGE LOAD
// ============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProducts();


        // ============================
        // SEARCH
        // ============================

        document
            .getElementById("searchProduct")
            .addEventListener(
                "input",
                filterProducts
            );


        // ============================
        // CATEGORY FILTER
        // ============================

        document
            .getElementById("categoryFilter")
            .addEventListener(
                "change",
                filterProducts
            );

    }
);


// ============================
// LOAD FARMER PRODUCTS
// ============================

async function loadProducts() {

    const tableBody =
        document.getElementById(
            "productTableBody"
        );


    try {

        console.log(
            "Loading products for Farmer ID:",
            userId
        );


        const response =
            await fetch(
                `${PRODUCT_API_URL}/farmer/${userId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        allProducts =
            await response.json();


        console.log(
            "Farmer Products:",
            allProducts
        );


        displayProducts(
            allProducts
        );


    }

    catch (error) {

        console.error(
            "Load Products Error:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-danger">

                    Unable to load products.

                    <br>

                    Make sure Spring Boot is running.

                </td>

            </tr>

        `;

    }

}


// ============================
// DISPLAY PRODUCTS
// ============================

function displayProducts(products) {

    const tableBody =
        document.getElementById(
            "productTableBody"
        );


    // Clear table

    tableBody.innerHTML = "";


    // ============================
    // NO PRODUCTS
    // ============================

    if (!products ||
        products.length === 0) {


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-muted">

                    No products found.

                    <br>

                    <a
                        href="add-product.html"
                        class="btn btn-success btn-sm mt-2">

                        <i class="bi bi-plus-circle"></i>

                        Add Your First Product

                    </a>

                </td>

            </tr>

        `;


        return;

    }


    // ============================
    // DISPLAY EACH PRODUCT
    // ============================

    products.forEach(function (product) {


        // ============================
        // IMAGE
        // ============================

        const imageUrl =
            product.imageUrl &&
            product.imageUrl.trim() !== ""

                ? product.imageUrl

                : "../images/no-image.png";


        // ============================
        // STATUS
        // ============================

        const status =
            product.availability || "Available";


        const statusClass =
            status.toLowerCase() === "available"

                ? "bg-success"

                : "bg-secondary";


        // ============================
        // CREATE ROW
        // ============================

        const row = `

            <tr>


                <!-- IMAGE -->

                <td>

                    <img
                        src="${imageUrl}"
                        alt="${product.name}"
                        width="65"
                        height="65"
                        style="
                            object-fit: cover;
                            border-radius: 8px;
                        "

                        onerror="
                            this.src='../images/no-image.png'
                        ">

                </td>



                <!-- PRODUCT -->

                <td>

                    ${product.name || "-"}

                </td>



                <!-- CATEGORY -->

                <td>

                    ${product.category || "-"}

                </td>



                <!-- QUANTITY -->

                <td>

                    ${product.quantity ?? "-"}

                    ${product.unit || ""}

                </td>



                <!-- PRICE -->

                <td>

                    ₹${product.price ?? "-"}

                    ${product.unit
                        ? "/" + product.unit
                        : ""
                    }

                </td>



                <!-- STATUS -->

                <td>

                    <span
                        class="badge ${statusClass}">

                        ${status}

                    </span>

                </td>



                <!-- ACTION -->

                <td>


                    <!-- EDIT -->

                    <button
                        class="btn btn-primary btn-sm me-1"
                        onclick="editProduct(${product.id})">

                        <i class="bi bi-pencil-square"></i>

                        Edit

                    </button>



                    <!-- DELETE -->

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteProduct(${product.id})">

                        <i class="bi bi-trash"></i>

                        Delete

                    </button>


                </td>


            </tr>

        `;


        tableBody.innerHTML += row;

    });

}


// ============================
// SEARCH + FILTER
// ============================

function filterProducts() {


    const searchText =
        document
            .getElementById("searchProduct")
            .value
            .toLowerCase()
            .trim();


    const category =
        document
            .getElementById("categoryFilter")
            .value;


    const filteredProducts =
        allProducts.filter(function (product) {


            // Search by name

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            // Filter by category

            const matchesCategory =

                category === "All"

                ||

                product.category === category;


            return matchesSearch &&
                matchesCategory;

        });


    displayProducts(
        filteredProducts
    );

}


// ============================
// EDIT PRODUCT
// ============================

function editProduct(productId) {


    console.log(
        "Editing Product ID:",
        productId
    );


    window.location.href =
        `edit-product.html?id=${productId}`;

}


// ============================
// DELETE PRODUCT
// ============================

async function deleteProduct(productId) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {

        return;

    }


    try {


        const response =
            await fetch(
                `${PRODUCT_API_URL}/${productId}`,

                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete product"
            );

        }


        alert(
            "Product deleted successfully!"
        );


        // Reload products

        loadProducts();


    }

    catch (error) {


        console.error(
            "Delete Error:",
            error
        );


        alert(
            "Unable to delete product."
        );

    }

}


// ============================
// LOGOUT
// ============================

function logout() {


    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    // ============================
    // CLEAR SESSION STORAGE
    // ============================

    sessionStorage.removeItem(
        "userId"
    );

    sessionStorage.removeItem(
        "fullName"
    );

    sessionStorage.removeItem(
        "userRole"
    );


    // ============================
    // CLEAR LOCAL STORAGE
    // ============================

    localStorage.removeItem(
        "userId"
    );

    localStorage.removeItem(
        "fullName"
    );

    localStorage.removeItem(
        "userRole"
    );


    console.log(
        "User logged out successfully"
    );


    // Redirect

    window.location.href =
        "login.html";

}