const API_URL = "http://localhost:8080/api/products";

let allProducts = [];


document.addEventListener("DOMContentLoaded", function () {

    loadProducts();


    document
        .getElementById("searchProduct")
        .addEventListener("input", filterProducts);


    document
        .getElementById("categoryFilter")
        .addEventListener("change", filterProducts);

});


// ===============================
// LOAD PRODUCTS FROM DATABASE
// ===============================

async function loadProducts() {

    const tableBody =
        document.getElementById("productTableBody");


    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                Loading products...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        allProducts =
            await response.json();


        displayProducts(allProducts);


    } catch (error) {

        console.error(error);


        tableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-danger">

                    Unable to connect to server.
                    Make sure Spring Boot is running.

                </td>
            </tr>
        `;

    }

}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(products) {

    const tableBody =
        document.getElementById("productTableBody");


    tableBody.innerHTML = "";


    if (products.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center">

                    No products found.

                </td>
            </tr>
        `;

        return;

    }


    products.forEach(function (product) {

        let imageDisplay = "🌾";


        if (
            product.imageUrl &&
            product.imageUrl.trim() !== ""
        ) {

            imageDisplay = `
                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                    width="50"
                    height="50"
                    style="
                        object-fit:cover;
                        border-radius:8px;
                    "
                >
            `;

        }


        let statusClass =
            product.availability === "Available"
                ? "bg-success"
                : "bg-secondary";


        const row = `

            <tr>

                <td>
                    ${imageDisplay}
                </td>


                <td>
                    ${product.name}
                </td>


                <td>
                    ${product.category}
                </td>


                <td>
                    ${product.quantity}
                    ${product.unit}
                </td>


                <td>
                    ₹${product.price}
                    /${product.unit}
                </td>


                <td>

                    <span class="badge ${statusClass}">

                        ${product.availability}

                    </span>

                </td>


                <td>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editProduct(${product.id})">

                        <i class="bi bi-pencil-square"></i>

                    </button>


                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteProduct(${product.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

        `;


        tableBody.innerHTML += row;

    });

}


// ===============================
// SEARCH + FILTER
// ===============================

function filterProducts() {

    const searchText =
        document
            .getElementById("searchProduct")
            .value
            .toLowerCase();


    const category =
        document
            .getElementById("categoryFilter")
            .value;


    const filteredProducts =
        allProducts.filter(function (product) {

            const matchesSearch =

                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =

                category === "All" ||
                product.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayProducts(filteredProducts);

}


// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
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


        loadProducts();


    } catch (error) {

        console.error(error);


        alert(
            "Error deleting product."
        );

    }

}


// ===============================
// EDIT PRODUCT
// ===============================

function editProduct(id) {

    window.location.href =
        `edit-product.html?id=${id}`;

}