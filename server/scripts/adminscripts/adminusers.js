const userModal = document.getElementById("userModal");
const addUserBtn = document.getElementById("addUserBtn");
const closeModal = document.querySelector(".close");
const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");

addUserBtn.onclick = () => {
  userModal.style.display = "flex";
  userForm.reset();
  clearErrors();
};

closeModal.onclick = () => {
  userModal.style.display = "none";
  clearErrors();
};

window.onclick = (e) => {
  if (e.target === userModal) {
    userModal.style.display = "none";
    clearErrors();
  }
};

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(el => el.remove());
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const error = document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  error.style.color = "red";
  error.style.fontSize = "13px";
  error.style.marginTop = "4px";
  input.parentNode.insertBefore(error, input.nextSibling);
}

userForm.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const contact = document.getElementById("contact").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const address = document.getElementById("address").value.trim();

  let isValid = true;

  // FIRST NAME
  if (!firstName) {
    showError("firstName", "First name is required.");
    isValid = false;
  }

  // LAST NAME
  if (!lastName) {
    showError("lastName", "Last name is required.");
    isValid = false;
  }

  // EMAIL
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError("email", "Email is required.");
    isValid = false;
  }
  if (email && !emailPattern.test(email)) {
    showError("email", "Enter a valid email address.");
    isValid = false;
  }

  // PASSWORD
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!password) {
    showError("password", "Password is required.");
    isValid = false;
  }
  if (password && !passwordPattern.test(password)) {
    showError("password", "Must be 8+ chars, with number and uppercase.");
    isValid = false;
  }

  // CONFIRM PASSWORD
  if (!confirmPassword) {
    showError("confirmPassword", "Confirm your password.");
    isValid = false;
  }
  if (confirmPassword && confirmPassword !== password) {
    showError("confirmPassword", "Passwords do not match.");
    isValid = false;
  }

  // CONTACT
  const contactPattern = /^09\d{9}$/;
  if (!contact) {
    showError("contact", "Contact number is required.");
    isValid = false;
  }
  if (contact && !contactPattern.test(contact)) {
    showError("contact", "Format must be like 09123456789.");
    isValid = false;
  }

  // AGE
  if (!age) {
    showError("age", "Age is required.");
    isValid = false;
  }
  if (age && age < 18) {
    showError("age", "User must be at least 18 years old.");
    isValid = false;
  }

  // ADDRESS
  if (!address) {
    showError("address", "Address is required.");
    isValid = false;
  }

  // Final check
  if (!isValid) return;

  // ✅ Add to table
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${firstName} ${lastName}</td>
    <td>${email}</td>
    <td>${contact}</td>
    <td>${age}</td>
    <td>${address}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").onclick = () => row.remove();
  userTableBody.appendChild(row);

  // Reset form + close
  userForm.reset();
  userModal.style.display = "none";
});
