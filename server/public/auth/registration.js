document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registration-form");

    registrationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const contact = document.getElementById("contact-number").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("con-pass").value;
        const age = parseInt(document.getElementById("age").value);
        const address = document.getElementById("address").value.trim();
        const userType = "customer"; // Default user type

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstName || !lastName || !email || !contact || !password || !confirmPassword || !address) {
            alert("All fields are required.");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!/^\d{11}$/.test(contact)) {
            alert("Contact number must be 11 digits long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (isNaN(age) || age <= 0) {
            alert("Please enter a valid age.");
            return;
        }

        if (age < 18) {
            alert("You must be at least 18 years old.");
            return;
        }

        const formData = {
            userType,
            firstName,
            lastName,
            email,
            contactNumber: contact,
            password,
            age,
            address
        };

        try {
            const res = await axios.post("/auth/register", formData)
            if (res.status === 201) {
                alert("Registration successful!");
                registrationForm.reset();
                window.location.href = "/auth/login";
            }
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";

            if (error.response?.status === 409 || message.includes("email")) {
                alert("Email already exists. Please use a different one.");
            } else {
                alert(message);
            }

            console.error("Error details:", error.response?.data || error.message);
        }
    });
});
