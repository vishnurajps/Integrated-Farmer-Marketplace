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

    alert("Please login first.");

    window.location.href = "login.html";

}


// ============================
// CHECK FARMER ROLE
// ============================

if (userRole !== "FARMER") {

    alert("Only farmers can access this page.");

    window.location.href = "login.html";

}


// ============================
// STORE PRODUCTS
// ============================

let allProducts = [];


// ============================
// PAGE LOAD
// ============================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Logged-in Farmer ID:", userId);

    loadProducts();


    // ============================
    // SEARCH
    // ============================

    const searchInput =
        document.getElementById("searchProduct");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    // ============================
    // CATEGORY FILTER
    // ============================

    const categoryFilter =
        document.getElementById("categoryFilter");

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }

});


// ============================
// LOAD FARMER PRODUCTS
// ============================

async function loadProducts() {

    const tableBody =
        document.getElementById("productTableBody");


    try {

        console.log(
            "Loading products for Farmer ID:",
            userId
        );


        const response = await fetch(
            `${PRODUCT_API_URL}/farmer/${userId}`
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Server Error:",
                errorText
            );

            throw new Error(
                "Failed to load products"
            );

        }


        allProducts =
            await response.json();


        console.log(
            "Loaded Products:",
            allProducts
        );


        displayProducts(allProducts);

    }

    catch (error) {

        console.error(
            "Load Products Error:",
            error
        );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="7"
                        class="text-center text-danger">

                        Unable to load products.

                    </td>

                </tr>

            `;

        }

    }

}


// ============================
// DISPLAY PRODUCTS
// ============================

function displayProducts(products) {

    const tableBody =
        document.getElementById("productTableBody");


    if (!tableBody) {

        console.error(
            "productTableBody not found"
        );

        return;

    }


    // Clear existing rows

    tableBody.innerHTML = "";


    // ============================
    // NO PRODUCTS
    // ============================

    if (!products || products.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7"
                    class="text-center text-muted">

                    No products found.

                    <br>

                    <a
                        href="add-product.html"
                        class="btn btn-success btn-sm mt-2">

                        Add Your First Product

                    </a>

                </td>

            </tr>

        `;

        return;

    }


    // ============================
    // DISPLAY PRODUCTS
    // ============================

    products.forEach(function (product) {


        const imageUrl =
            product.imageUrl &&
            product.imageUrl.trim() !== ""

                ? product.imageUrl

                : "../images/no-image.png";


        const status =
            product.availability || "Available";


        const statusClass =
            status.toLowerCase() === "available"

                ? "bg-success"

                : "bg-secondary";


        const row = `

            <tr>

                <!-- IMAGE -->

                <td>

                    <img
                        src="${imageUrl}"
                        alt="Product Image"
                        width="65"
                        height="65"
                        style="
                            object-fit: cover;
                            border-radius: 8px;
                        "

                        onerror="
                            this.onerror=null;
                            this.src='../images/no-image.png';
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

                    <span class="badge ${statusClass}">

                        ${status}

                    </span>

                </td>


                <!-- ACTION -->

                <td>

                    <button
                        type="button"
                        class="btn btn-primary btn-sm me-1"
                        onclick="editProduct(${product.id})">

                        <i class="bi bi-pencil"></i>
                        Edit

                    </button>


                    <button
                        type="button"
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

    const searchElement =
        document.getElementById("searchProduct");

    const categoryElement =
        document.getElementById("categoryFilter");


    const searchText =
        searchElement
            ? searchElement.value.toLowerCase().trim()
            : "";


    const category =
        categoryElement
            ? categoryElement.value
            : "All";


    const filteredProducts =
        allProducts.filter(function (product) {


            const productName =
                (product.name || "")
                    .toLowerCase();


            const productCategory =
                product.category || "";


            // Search

            const matchesSearch =
                productName.includes(searchText);


            // Category

            const matchesCategory =

                category === "All"

                ||

                productCategory === category;


            return matchesSearch &&
                matchesCategory;

        });


    displayProducts(filteredProducts);

}


// ============================
// EDIT PRODUCT
// ============================

function editProduct(productId) {

    console.log(
        "Editing Product ID:",
        productId
    );


    if (!productId) {

        alert("Invalid Product ID.");

        return;

    }


    // IMPORTANT:
    // Send product ID in URL

    window.location.href =
        `edit-product.html?id=${encodeURIComponent(productId)}`;

}


// ============================
// DELETE PRODUCT
// ============================

async function deleteProduct(productId) {

    if (!productId) {

        alert("Invalid Product ID.");

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        console.log(
            "Deleting Product:",
            productId
        );


        const response = await fetch(

            `${PRODUCT_API_URL}/${productId}/farmer/${userId}`,

            {
                method: "DELETE"
            }

        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Delete Error:",
                errorText
            );

            throw new Error(errorText);

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


    // Clear session storage

    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("fullName");
    sessionStorage.removeItem("userRole");


    // Clear local storage

    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userRole");


    alert("Logged out successfully!");


    window.location.href =
        "login.html";

}