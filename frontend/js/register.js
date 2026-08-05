// ============================
// State → District Dropdown
// ============================

const districts = {

"Tamil Nadu":[
"Erode",
"Coimbatore",
"Salem",
"Chennai",
"Madurai"
],

"Karnataka":[
"Bengaluru",
"Mysuru",
"Mangaluru",
"Belagavi"
],

"Kerala":[
"Kochi",
"Kozhikode",
"Thrissur",
"Kannur"
],

"Andhra Pradesh":[
"Visakhapatnam",
"Vijayawada",
"Guntur",
"Tirupati"
]

};

const state = document.getElementById("state");
const district = document.getElementById("district");

state.addEventListener("change", function () {

    district.innerHTML = "<option value=''>Select District</option>";

    const list = districts[this.value];

    if (list) {

        list.forEach(function (item) {

            district.innerHTML += `<option value="${item}">${item}</option>`;

        });

    }

});

// ============================
// Show / Hide Password
// ============================

function togglePassword(id, button) {

    const input = document.getElementById(id);

    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = "🙈";
    } else {
        input.type = "password";
        button.innerHTML = "👁";
    }

}

// ============================
// Password Strength
// ============================

const password = document.getElementById("password");

password.addEventListener("keyup", function () {

    const text = document.getElementById("strengthText");

    if (password.value.length < 6) {

        text.innerHTML = "Weak Password";
        text.style.color = "red";

    } else if (password.value.length < 10) {

        text.innerHTML = "Medium Password";
        text.style.color = "orange";

    } else {

        text.innerHTML = "Strong Password";
        text.style.color = "green";

    }

});

// ============================
// Confirm Password Validation
// ============================

const confirmPassword = document.getElementById("confirmPassword");

confirmPassword.addEventListener("keyup", function () {

    const match = document.getElementById("matchText");

    if (password.value === confirmPassword.value) {

        match.innerHTML = "✓ Passwords Match";
        match.style.color = "green";

    } else {

        match.innerHTML = "✗ Passwords Do Not Match";
        match.style.color = "red";

    }

});

// ============================
// Mobile Number Validation
// ============================

const mobile = document.getElementById("mobile");

mobile.addEventListener("input", function () {

    mobile.value = mobile.value.replace(/[^0-9]/g, "");

    const error = document.getElementById("mobileError");

    if (mobile.value.length === 10) {

        error.innerHTML = "✓ Valid Mobile Number";
        error.style.color = "green";

    } else {

        error.innerHTML = "Enter 10-digit Mobile Number";
        error.style.color = "red";

    }

});

// ============================
// Advisor Fields
// ============================

const role = document.getElementById("role");
const advisorFields = document.getElementById("advisorFields");

role.addEventListener("change", function () {

    if (this.value === "ADVISOR") {

        advisorFields.style.display = "block";

    } else {

        advisorFields.style.display = "none";

    }

});

// ============================
// Register User
// ============================

async function registerUser() {

    // Password Match Check
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    const data = {

        fullName: document.getElementById("fullName").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value,

        role: document.getElementById("role").value,

        state: document.getElementById("state").value,

        district: document.getElementById("district").value,

        address: document.getElementById("address").value.trim(),

        certificateNumber: document.getElementById("certificateNumber").value.trim()

    };

    try {

        const response = await fetch("http://localhost:8080/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.text();

        if (response.ok) {

            alert(result);

            document.querySelector("form").reset();

            advisorFields.style.display = "none";

            document.getElementById("strengthText").innerHTML = "";
            document.getElementById("matchText").innerHTML = "";
            document.getElementById("mobileError").innerHTML = "";

        } else {

            alert("Error: " + result);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to Spring Boot Server.");

    }

}