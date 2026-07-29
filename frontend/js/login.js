// Show / Hide Password

function togglePassword(){

    const password=document.getElementById("password");

    if(password.type==="password"){

        password.type="text";

    }

    else{

        password.type="password";

    }

}

// Mobile Validation

const mobile=document.getElementById("mobile");

mobile.addEventListener("input",function(){

    mobile.value=mobile.value.replace(/[^0-9]/g,"");

    const error=document.getElementById("mobileError");

    if(mobile.value.length===10){

        error.innerHTML="✓ Valid Mobile Number";

        error.style.color="green";

    }

    else{

        error.innerHTML="Enter 10-digit Mobile Number";

        error.style.color="red";

    }

});

// Login Validation

document.getElementById("loginForm").addEventListener("submit",function(e){

    e.preventDefault();

    if(mobile.value.length!==10){

        alert("Enter a valid Mobile Number");

        return;

    }

    alert("Backend Connection Coming Next!");

});