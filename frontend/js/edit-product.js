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

    alert("Only farmers can edit products.");

    window.location.href = "login.html";

}


// ============================
// GET PRODUCT ID FROM URL
// ============================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const productId =
    urlParams.get("id");


console.log("URL:", window.location.href);

console.log("Product ID:", productId);

console.log("Farmer ID:", userId);


// ============================
// CHECK PRODUCT ID
// ============================

if (!productId) {

    alert("Product ID not found.");

    window.location.href =
        "my-products.html";

}


// ============================
// PAGE LOAD
// ============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProduct();


        // ============================
        // FORM SUBMIT
        // ============================

        const form =
            document.getElementById(
                "editProductForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                updateProduct
            );

        }

        else {

            console.error(
                "editProductForm not found!"
            );

        }


        // ============================
        // IMAGE PREVIEW
        // ============================

        setupImagePreview();

    }
);


// ============================
// LOAD PRODUCT
// ============================

async function loadProduct() {

    try {

        console.log(
            "Loading Product:",
            productId
        );


        // IMPORTANT:
        // Load product belonging to this farmer

        const response =
            await fetch(

                `${PRODUCT_API_URL}/${productId}/farmer/${userId}`

            );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Load Product Server Error:",
                errorText
            );


            throw new Error(
                "Unable to load product"
            );

        }


        const product =
            await response.json();


        console.log(
            "Loaded Product:",
            product
        );


        // ============================
        // FILL FORM
        // ============================

        document.getElementById("name").value =
            product.name || "";


        document.getElementById("category").value =
            product.category || "";


        document.getElementById("quantity").value =
            product.quantity ?? "";


        document.getElementById("unit").value =
            product.unit || "Kg";


        document.getElementById("price").value =
            product.price ?? "";


        document.getElementById("harvestDate").value =
            product.harvestDate || "";


        document.getElementById("location").value =
            product.location || "";


        document.getElementById("description").value =
            product.description || "";


        document.getElementById("availability").value =
            product.availability || "Available";


        document.getElementById("imageUrl").value =
            product.imageUrl || "";


        // ============================
        // IMAGE PREVIEW
        // ============================

        const preview =
            document.getElementById("preview");


        if (preview) {

            preview.src =
                product.imageUrl ||
                "../images/no-image.png";

        }

    }

    catch (error) {

        console.error(
            "Load Product Error:",
            error
        );


        alert(
            "Unable to load this product."
        );


        window.location.href =
            "my-products.html";

    }

}


// ============================
// UPDATE PRODUCT
// ============================

async function updateProduct(event) {

    event.preventDefault();


    // ============================
    // VALIDATE PRODUCT ID
    // ============================

    if (!productId) {

        alert("Product ID not found.");

        return;

    }


    // ============================
    // CREATE UPDATED PRODUCT
    // ============================

    const updatedProduct = {

        name:
            document
                .getElementById("name")
                .value
                .trim(),


        category:
            document
                .getElementById("category")
                .value
                .trim(),


        quantity:
            parseFloat(
                document
                    .getElementById("quantity")
                    .value
            ),


        unit:
            document
                .getElementById("unit")
                .value,


        price:
            parseFloat(
                document
                    .getElementById("price")
                    .value
            ),


        harvestDate:
            document
                .getElementById("harvestDate")
                .value || null,


        location:
            document
                .getElementById("location")
                .value
                .trim(),


        description:
            document
                .getElementById("description")
                .value
                .trim(),


        availability:
            document
                .getElementById("availability")
                .value,


        imageUrl:
            document
                .getElementById("imageUrl")
                .value
                .trim() || null

    };


    console.log(
        "Updating Product ID:",
        productId
    );


    console.log(
        "Updated Product:",
        updatedProduct
    );


    const updateButton =
        document.getElementById(
            "updateButton"
        );


    try {

        // Disable button

        if (updateButton) {

            updateButton.disabled = true;

            updateButton.innerHTML =
                "Updating...";

        }


        // ============================
        // CALL UPDATE API
        // ============================

        const response =
            await fetch(

                `${PRODUCT_API_URL}/${productId}/farmer/${userId}`,

                {

                    method: "PUT",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify(
                            updatedProduct
                        )

                }

            );


        // ============================
        // HANDLE ERROR
        // ============================

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Update Server Error:",
                errorText
            );


            throw new Error(
                errorText ||
                "Failed to update product"
            );

        }


        const result =
            await response.json();


        console.log(
            "Updated Product:",
            result
        );


        alert(
            "Product updated successfully!"
        );


        // Go back to My Products

        window.location.href =
            "my-products.html";


    }

    catch (error) {

        console.error(
            "Update Product Error:",
            error
        );


        alert(
            "Product could not be updated: " +
            error.message
        );

    }

    finally {

        if (updateButton) {

            updateButton.disabled = false;

            updateButton.innerHTML = `

                <i class="bi bi-check-circle"></i>

                Update Product

            `;

        }

    }

}


// ============================
// IMAGE PREVIEW
// ============================

function setupImagePreview() {

    const imageUrlInput =
        document.getElementById("imageUrl");


    const preview =
        document.getElementById("preview");


    if (!imageUrlInput || !preview) {

        return;

    }


    // Change preview

    imageUrlInput.addEventListener(
        "input",
        function () {

            const imageUrl =
                imageUrlInput.value.trim();


            preview.src =
                imageUrl ||
                "../images/no-image.png";

        }
    );


    // Invalid image

    preview.addEventListener(
        "error",
        function () {

            if (
                !preview.src.includes(
                    "no-image.png"
                )
            ) {

                preview.src =
                    "../images/no-image.png";

            }

        }
    );

}