function validateForm() {
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const nameError = document.getElementById("nameerror");
    const passwordError = document.getElementById("passworderror");
    
    // Reset error messages
    nameError.textContent = "";
    passwordError.textContent = "";

    let isValid = true;

    // Validation for username
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Username is required";
        isValid = false;
    }

    // Validation for password
    if (passwordInput.value.trim() === "") {
        passwordError.textContent = "Password is required";
        isValid = false;
    }

    if (isValid) {
        const formData = {
            userName: nameInput.value,
            password: passwordInput.value
        };

        const userdata = ' https://hastin-container.com/staging/app/auth/login';
        fetch(userdata, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Login successful! .");
        })
    }
}


