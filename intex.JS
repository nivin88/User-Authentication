document.getElementById('showPassword').addEventListener('change', function() {
    const passwordField = document.getElementById('password');
    passwordField.type = this.checked ? 'text' : 'password';
});

function validateForm(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const nameError = document.getElementById('nameerror');
    const passwordError = document.getElementById('passworderror');
    let isValid = true;

    // Validate username
    if (nameInput === "") {
        nameError.textContent = "Username is required*";
        isValid = false;
    } else {
        nameError.textContent = '';
    }

    // Validate password
    if (passwordInput === "") {
        passwordError.textContent = "Password is required*";
        isValid = false;
    } else if (passwordInput.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters.";
        isValid = false;
    } else {
        passwordError.textContent = '';
    }

    if (isValid) {
        const formData = {
            userName: nameInput,
            password: passwordInput
        };
        submitForm(formData);
    }
}

async function submitForm(data) {
    try {
        const response = await fetch('https://hastin-container.com/staging/app/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("User Login Successful:", result);

            // Check for required fields in response
            if (result.data && result.data.opaque && result.data.accessCode && result.data.jwt) {
                localStorage.setItem('opaque', result.data.opaque);
                localStorage.setItem('accessCode', result.data.accessCode);
                localStorage.setItem('jwtToken', result.data.jwt);
                alert("Login successful!");
                showOtpModal();
            } else {
                throw new Error("Login failed: Missing data in response.");
            }
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error submitting the form.");
    }
}

function showOtpModal() {
    document.getElementById('otpModal').style.display = 'block';
    const opaque = localStorage.getItem('opaque');
    const accessCode = localStorage.getItem('accessCode');
    document.getElementById('otpPrefix').textContent = opaque || "N/A"; // Show 'N/A' if opaque is missing
    document.getElementById('otpInput').value = accessCode || "";       // Prefill with access code if available
}

function closeOtpModal() {
    document.getElementById('otpModal').style.display = 'none';
}

function resendOtp() {
    const opaque = localStorage.getItem('opaque');
    const accessCode = localStorage.getItem('accessCode');

    if (opaque && accessCode) {
        sendOtp({ opaque, accessCode });
    } else {
        alert("Required data is missing. Please log in again.");
    }
}

async function sendOtp(data) {
    try {
        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            alert("Authorization token is missing.");
            return;
        }

        const response = await fetch('https://hastin-container.com/staging/app/auth/access-code/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("OTP Validation Successful:", result);
            alert("OTP validated successfully!");
            closeOtpModal();
            document.getElementById('form').reset();
        } else {
            throw new Error("OTP validation failed");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error validating the OTP.");
    }
}


