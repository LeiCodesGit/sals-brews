const userModal = document.getElementById("userModal");
const addUserBtn = document.getElementById("addUserBtn");
const closeModal = document.querySelector(".close");
const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");

let isEditMode = false;
let editingUserId = null;

// Show Modal for Add
addUserBtn.onclick = () => {
  isEditMode = false;
  editingUserId = null;
  userModal.style.display = "flex";
  userForm.reset();
  clearErrors();
  document.getElementById("modalTitle").textContent = "Add User";
  document.getElementById("email").disabled = false;
  document.getElementById("password").required = true;
  document.getElementById("confirmPassword").required = true;
};

// Close Modal
closeModal.onclick = () => {
  userModal.style.display = "none";
  clearErrors();
};

// Close if click outside modal
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

userForm.addEventListener("submit", async function (e) {
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

  if (!firstName) { showError("firstName", "First name is required."); isValid = false; }
  if (!lastName) { showError("lastName", "Last name is required."); isValid = false; }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) { showError("email", "Email is required."); isValid = false; }
  else if (!emailPattern.test(email)) { showError("email", "Invalid email format."); isValid = false; }

  if (!isEditMode || password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password) { showError("password", "Password is required."); isValid = false; }
    else if (!passwordPattern.test(password)) { showError("password", "Must be 8+ chars, with number and uppercase."); isValid = false; }

    if (!confirmPassword) { showError("confirmPassword", "Please confirm password."); isValid = false; }
    else if (confirmPassword !== password) { showError("confirmPassword", "Passwords do not match."); isValid = false; }
  }

  const contactPattern = /^09\d{9}$/;
  if (!contact) { showError("contact", "Contact is required."); isValid = false; }
  else if (!contactPattern.test(contact)) { showError("contact", "Format must be 09123456789."); isValid = false; }

  if (!age) { showError("age", "Age is required."); isValid = false; }
  else if (age < 18) { showError("age", "Must be at least 18."); isValid = false; }

  if (!address) { showError("address", "Address is required."); isValid = false; }

  if (!isValid) return;

  const userData = {
    firstName,
    lastName,
    email,
    contactNumber: contact,
    age,
    address,
  };

  if (!isEditMode || password) {
    userData.password = password;
  }

  try {
    if (isEditMode) {
      await fetch(`/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
    } else {
      await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
    }

    userModal.style.display = "none";
    userForm.reset();
    loadUsers();
  } catch (err) {
    alert("Error saving user.");
  }
});

function openEditModal(user) {
  isEditMode = true;
  editingUserId = user._id;
  userModal.style.display = "flex";
  clearErrors();

  document.getElementById("modalTitle").textContent = "Edit User";

  document.getElementById("firstName").value = user.firstName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("email").value = user.email;
  document.getElementById("email").disabled = true;
  document.getElementById("password").value = "";
  document.getElementById("confirmPassword").value = "";
  document.getElementById("password").required = false;
  document.getElementById("confirmPassword").required = false;
  document.getElementById("contact").value = user.contactNumber;
  document.getElementById("age").value = user.age;
  document.getElementById("address").value = user.address;
}

async function deleteUser(userId) {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    await fetch(`/users/${userId}`, { method: "DELETE" });
    loadUsers();
  } catch (err) {
    alert("Error deleting user.");
  }
}
