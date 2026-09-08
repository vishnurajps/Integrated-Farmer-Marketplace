// ============================
// API URL
// ============================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products";


// ============================
// GET PRODUCT ID FROM URL
// ============================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const productId =
    urlParams.get("id");


// ============================
// CHECK PRODUCT ID
// ============================

if (!productId) {

    alert(
        "Product ID not found."
    );


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

    }
);


// ============================
// LOAD PRODUCT
// ============================

async function loadProduct() {


    try {


        const response =
            await fetch(
                `${PRODUCT_API_URL}/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                "Product not found"
            );

        }


        const product =
            await response.json();


        console.log(
            "Product Loaded:",
            product
        );


        // Fill form

        document.getElementById("name").value =
            product.name || "";


        document.getElementById("category").value =
            product.category || "";


        document.getElementById("quantity").value =
            product.quantity ?? "";


        document.getElementById("unit").value =
            product.unit || "";


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


    }

    catch (error) {


        console.error(
            "Load Product Error:",
            error
        );


        alert(
            "Unable to load product."
        );

    }

}


// ============================
// UPDATE PRODUCT
// ============================

document
    .getElementById("editProductForm")
    .addEventListener(
        "submit",
        async function (event) {


            event.preventDefault();


            const product = {


                name:
                    document.getElementById("name")
                        .value
                        .trim(),


                category:
                    document.getElementById("category")
                        .value
                        .trim(),


                quantity:
                    parseFloat(
                        document
                            .getElementById("quantity")
                            .value
                    ),


                unit:
                    document.getElementById("unit")
                        .value
                        .trim(),


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


            try {


                const response =
                    await fetch(
                        `${PRODUCT_API_URL}/${productId}`,

                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(product)

                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        errorText
                    );

                }


                alert(
                    "Product updated successfully!"
                );


                window.location.href =
                    "my-products.html";


            }

            catch (error) {


                console.error(
                    "Update Error:",
                    error
                );


                alert(
                    "Unable to update product."
                );

            }

        }
    );