// Current Date

const today = new Date();

const options = {

    weekday: 'long',

    year: 'numeric',

    month: 'long',

    day: 'numeric'

};

document.getElementById("currentDate").innerHTML =
today.toLocaleDateString("en-IN", options);

// Sales Chart

const ctx = document.getElementById("salesChart");

new Chart(ctx, {

    type: "line",

    data: {

        labels: [

            "Jan",

            "Feb",

            "Mar",

            "Apr",

            "May",

            "Jun"

        ],

        datasets: [{

            label: "Sales",

            data: [

                20,

                35,

                28,

                45,

                52,

                60

            ],

            borderColor: "#2E7D32",

            backgroundColor: "rgba(46,125,50,.2)",

            fill: true,

            tension: 0.4

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                display: true

            }

        }

    }

});