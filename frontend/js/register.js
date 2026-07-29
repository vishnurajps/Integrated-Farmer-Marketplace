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

    district.innerHTML = "<option>Select District</option>";

    const list = districts[this.value];

    if (list) {

        list.forEach(function (item) {

            district.innerHTML += `<option>${item}</option>`;

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