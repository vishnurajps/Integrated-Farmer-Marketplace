// ============================
// PRODUCT API
// ============================

const PRODUCT_API_URL =
    "http://localhost:8080/api/products";


// ============================
// GET LOGGED-IN USER
// ============================

const farmerId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");


const userRole =
    sessionStorage.getItem("userRole") ||
    localStorage.getItem("userRole");


// ============================
// CHECK LOGIN
// ============================

if (!farmerId || userRole !== "FARMER") {

    alert("Please login as a farmer.");

    window.location.href = "login.html";

}


// ============================
// API URL
// ============================

const API_URL =
    `${PRODUCT_API_URL}/farmer/${farmerId}`;


// ============================
// PAGE LOAD
// ============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const productForm =
            document.getElementById("productForm");

        const imageUrlInput =
            document.getElementById("imageUrl");

        const preview =
            document.getElementById("preview");


        // ==========================
        // CHECK FORM
        // ==========================

        if (!productForm) {

            console.error(
                "Product form not found"
            );

            return;

        }


        // ==========================
        // IMAGE PREVIEW
        // ==========================

        if (imageUrlInput && preview) {

            imageUrlInput.addEventListener(
                "input",
                function () {

                    const imageUrl =
                        imageUrlInput.value.trim();


                    if (imageUrl !== "") {

                        preview.src = imageUrl;

                    } else {

                        preview.src =
                            "../images/no-image.png";

                    }

                }
            );

        }


        // ==========================
        // INVALID IMAGE HANDLING
        // ==========================

        if (preview) {

            preview.addEventListener(
                "error",
                function () {

                    preview.src =
                        "../images/no-image.png";

                }
            );

        }


        // ==========================
        // ADD PRODUCT
        // ==========================

        productForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // ==========================
                // CREATE PRODUCT OBJECT
                // ==========================

                const product = {

                    name:
                        document
                            .getElementById("name")
                            .value
                            .trim(),


                    category:
                        document
                            .getElementById("category")
                            .value,


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


                // ==========================
                // DEBUG
                // ==========================

                console.log(
                    "Logged-in Farmer ID:",
                    farmerId
                );

                console.log(
                    "API URL:",
                    API_URL
                );

                console.log(
                    "Sending Product:",
                    product
                );


                // ==========================
                // SEND PRODUCT TO BACKEND
                // ==========================

                try {

                    const response =
                        await fetch(
                            API_URL,
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(product)

                            }
                        );


                    // ==========================
                    // HANDLE SERVER ERROR
                    // ==========================

                    if (!response.ok) {

                        const errorText =
                            await response.text();


                        console.error(
                            "Server Error:",
                            errorText
                        );


                        throw new Error(
                            errorText ||
                            "Failed to add product"
                        );

                    }


                    // ==========================
                    // SUCCESS
                    // ==========================

                    const savedProduct =
                        await response.json();


                    console.log(
                        "Product Added Successfully:",
                        savedProduct
                    );


                    alert(
                        "Product added successfully!"
                    );


                    productForm.reset();


                    if (preview) {

                        preview.src =
                            "../images/no-image.png";

                    }


                    // Redirect

                    window.location.href =
                        "my-products.html";


                }

                catch (error) {

                    console.error(
                        "Product Error:",
                        error
                    );


                    alert(
                        "Product could not be added. Check the browser console and Spring Boot terminal."
                    );

                }

            }
        );

    }
);