// ============================
// GET LOGGED-IN USER
// ============================

const farmerId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId");


// ============================
// CHECK LOGIN
// ============================

if (!farmerId) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// ============================
// API URL
// ============================

const API_URL =
    `http://localhost:8080/api/products/farmer/${farmerId}`;


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

                    }

                    else {

                        preview.src =
                            "../images/no-image.png";

                    }

                }
            );

        }


        // ==========================
        // INVALID IMAGE
        // ==========================

        if (preview) {

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


        // ==========================
        // ADD PRODUCT
        // ==========================

        productForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


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


                console.log(
                    "Farmer ID:",
                    farmerId
                );


                console.log(
                    "Sending Product:",
                    product
                );


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


                    if (!response.ok) {

                        const errorText =
                            await response.text();


                        console.error(
                            "Server Error:",
                            errorText
                        );


                        throw new Error(
                            errorText
                        );

                    }


                    const savedProduct =
                        await response.json();


                    console.log(
                        "Product Added:",
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


                    window.location.href =
                        "my-products.html";


                }

                catch (error) {

                    console.error(
                        "Product Error:",
                        error
                    );


                    alert(
                        "Product could not be added."
                    );

                }

            }
        );

    }
);