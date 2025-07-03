// ======= DOM Elements =======
const userModal = document.getElementById("userModal");
const addUserBtn = document.getElementById("addUserBtn");
const closeModal = document.querySelector(".close");
const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");

// ======= State =======
let isEditMode = false;
let editingUserId = null;

// ======= Modal Controls =======

// Open modal for new user
addUserBtn.onclick = () => {
  isEditMode = false;
  editingUserId = null;
  userForm.reset();
  clearErrors();
  document.getElementById("modalTitle").textContent = "Add User";
  document.getElementById("email").disabled = false;
  userModal.style.display = "flex";
};

// Close modal
closeModal.onclick = () => {
  userModal.style.display = "none";
  clearErrors();
};

// ======= Utility Functions =======

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(el => el.remove());
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const error = document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  input.parentNode.insertBefore(error, input.nextSibling);
}

function renderUsers(users) {
  userTableBody.innerHTML = "";
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.contactNumber}</td>
      <td>${user.age}</td>
      <td>${user.address}</td>
      <td>
        <button class="edit-btn" data-id="${user._id}">Edit</button>
        <button class="delete-btn" data-id="${user._id}">Delete</button>
      </td>
    `;

    row.querySelector(".edit-btn").onclick = () => openEditModal(user);
    row.querySelector(".delete-btn").onclick = () => deleteUser(user._id);
    userTableBody.appendChild(row);
  });
}

// Fetch all users on load
async function loadUsers() {
  const res = await fetch("/users");
  const users = await res.json();
  renderUsers(users);
}

loadUsers();

// ======= Add/Edit User =======

userForm.addEventListener("submit", async e => {
  e.preventDefault();
  clearErrors();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const age = document.getElementById("age").value.trim();
  const address = document.getElementById("address").value.trim();
  const userType = document.getElementById("accountType").value;

  let hasError = false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // === Validation ===
  if (!firstName) { showError("firstName", "First name is required"); hasError = true; }
  if (!lastName) { showError("lastName", "Last name is required"); hasError = true; }
  if (!email) { showError("email", "Email is required"); hasError = true; }
  else if (!emailRegex.test(email)) { showError("email", "Invalid email format"); hasError = true; }
  if (!contact) { showError("contact", "Contact number is required"); hasError = true; }
  else if (!/^\d{11}$/.test(contact)) { showError("contact", "Must be 11 digits"); hasError = true; }
  if (!password) { showError("password", "Password is required"); hasError = true; }
  if (!confirmPassword) { showError("confirmPassword", "Confirm your password"); hasError = true; }
  else if (password !== confirmPassword) { showError("confirmPassword", "Passwords do not match"); hasError = true; }
  if (!age || isNaN(age) || age < 18) { showError("age", "Must be 18 or older"); hasError = true; }
  if (!address) { showError("address", "Address is required"); hasError = true; }
  if (!userType) { showError("accountType", "Please select an account type"); hasError = true; }

  if (hasError) return;

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
    const res = await axios.post("/admin/users", formData);
    if (res.status === 201) {
      alert("User added successfully!");
      userForm.reset();
      userModal.style.display = "none";
      loadUsers();
    }
  } catch (error) {
    const message = error.response?.data?.message || "Error adding user.";
    if (error.response?.status === 409 || message.includes("email")) {
      showError("email", "Email already exists");
    } else {
      alert(message);
    }
    console.error("Error:", error);
  }
});

// ======= Edit User (Pre-fill Form) =======

function openEditModal(user) {
  isEditMode = true;
  editingUserId = user._id;
  clearErrors();

  document.getElementById("modalTitle").textContent = "Edit User";
  document.getElementById("email").disabled = true;

  document.getElementById("firstName").value = user.firstName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("email").value = user.email;
  document.getElementById("password").value = "";
  document.getElementById("confirmPassword").value = "";
  document.getElementById("password").required = false;
  document.getElementById("confirmPassword").required = false;
  document.getElementById("contact").value = user.contactNumber;
  document.getElementById("age").value = user.age;
  document.getElementById("address").value = user.address;
  document.getElementById("accountType").value = user.userType;

  userModal.style.display = "flex";
}

// ======= Delete User =======

async function deleteUser(userId) {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    await fetch(`/admin/users/${userId}`, { method: "DELETE" });
    loadUsers();
  } catch (err) {
    alert("Error deleting user.");
    console.error(err);
  }
  
}
// Prevent closing modal when clicking inside
userModal.addEventListener("click", () => {
  userModal.style.display = "none";
});
document.getElementById("modalContent").addEventListener("click", e => {
  e.stopPropagation(); // Stops the event from reaching the outer modal
});