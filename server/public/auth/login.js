document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        // Disable the login button
        loginButton.setAttribute("disabled", true);

        axios({
        method: "post",
        url: "/auth/login",
        data: data,
        })
        .then((res) => {
            window.location.href = "/home";
        })
        .catch((error) => {
            loginButton.removeAttribute("disabled");

            if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            } else {
            alert("Login failed. Try again.");
            }

            console.error(error);
        });
    });
});
