const API_URL = "http://localhost:8080/api/products";


const urlParams = new URLSearchParams(window.location.search);

const productId = urlParams.get("id");


document.addEventListener("DOMContentLoaded", function () {

    // Check product ID

    if (!productId) {

        alert("Product ID not found!");

        window.location.href = "my-products.html";

        return;

    }


    // Load existing product

    loadProduct();


    // Update product

    document
        .getElementById("editProductForm")
        .addEventListener("submit", updateProduct);

});


// ======================================
// LOAD PRODUCT DETAILS
// ======================================

async function loadProduct() {

    try {

        const response = await fetch(
            `${API_URL}/${productId}`
        );


        if (!response.ok) {

            throw new Error("Product not found");

        }


        const product = await response.json();


        // Fill form

        document.getElementById("name").value =
            product.name || "";

        document.getElementById("category").value =
            product.category || "";

        document.getElementById("quantity").value =
            product.quantity || "";

        document.getElementById("unit").value =
            product.unit || "";

        document.getElementById("price").value =
            product.price || "";

        document.getElementById("harvestDate").value =
            product.harvestDate || "";

        document.getElementById("location").value =
            product.location || "";

        document.getElementById("description").value =
            product.description || "";

        document.getElementById("availability").value =
            product.availability || "";

        document.getElementById("imageUrl").value =
            product.imageUrl || "";


    } catch (error) {

        console.error(error);

        alert("Unable to load product details.");

        window.location.href =
            "my-products.html";

    }

}


// ======================================
// UPDATE PRODUCT
// ======================================

async function updateProduct(event) {

    event.preventDefault();


    const product = {

        name:
            document.getElementById("name").value,

        category:
            document.getElementById("category").value,

        quantity:
            parseFloat(
                document.getElementById("quantity").value
            ),

        unit:
            document.getElementById("unit").value,

        price:
            parseFloat(
                document.getElementById("price").value
            ),

        harvestDate:
            document.getElementById("harvestDate").value || null,

        location:
            document.getElementById("location").value,

        description:
            document.getElementById("description").value,

        availability:
            document.getElementById("availability").value,

        imageUrl:
            document.getElementById("imageUrl").value || null

    };


    try {

        const response = await fetch(

            `${API_URL}/${productId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(product)

            }

        );


        if (!response.ok) {

            throw new Error(
                "Failed to update product"
            );

        }


        alert(
            "Product updated successfully!"
        );


        window.location.href =
            "my-products.html";


    } catch (error) {

        console.error(error);

        alert(
            "Error updating product. Please try again."
        );

    }

}