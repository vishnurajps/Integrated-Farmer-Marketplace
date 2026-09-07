// ======================================
// IFMAP PLATFORM STATISTICS
// ======================================

async function loadStatistics() {

    try {

        console.log("Loading statistics...");

        const response = await fetch(
            "http://localhost:8080/api/statistics"
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load statistics"
            );

        }

        const data = await response.json();

        console.log("Statistics received:", data);


        // Farmer Count

        document.getElementById("farmerCount").innerText =
            data.farmers;


        // Buyer Count

        document.getElementById("buyerCount").innerText =
            data.buyers;


        // Advisor Count

        document.getElementById("advisorCount").innerText =
            data.advisors;


        // Product Count

        document.getElementById("productCount").innerText =
            data.products;

    }

    catch (error) {

        console.error(
            "Error loading statistics:",
            error
        );

    }

}


// Load statistics when page opens

document.addEventListener(
    "DOMContentLoaded",
    loadStatistics
);