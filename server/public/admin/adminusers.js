document.addEventListener("DOMContentLoaded", () => {
  const userModal = document.getElementById("userModal");
  const addUserBtn = document.getElementById("addUserBtn");
  const closeModal = document.querySelector(".close");
  const userForm = document.getElementById("userForm");
  const userTableBody = document.getElementById("userTableBody");

  let isEditMode = false;
  let editingUserId = null;

  addUserBtn.onclick = () => {
    isEditMode = false;
    editingUserId = null;
    userForm.reset();
    clearErrors();
    document.getElementById("modalTitle").textContent = "Add User";
    document.getElementById("email").disabled = false;
    userModal.style.display = "flex";
  };

  closeModal.onclick = () => {
    userModal.style.display = "none";
    clearErrors();
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
    input.parentNode.insertBefore(error, input.nextSibling);
  }

  function renderUsers(users) {
  const adminBody = document.getElementById("adminTableBody");
  const userBody = document.getElementById("userTableBody");

  if (!adminBody || !userBody) {
    console.error("Missing table body elements.");
    return;
  }

  adminBody.innerHTML = "";
  userBody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");

    if (user.userType === "admin") {
      row.innerHTML = `
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.contactNumber}</td>
        <td>${user.userType}</td>
        <td>
          <button class="edit-btn" data-id="${user._id}">Edit</button>
          <button class="delete-btn" data-id="${user._id}">Delete</button>
        </td>
      `;
      row.querySelector(".edit-btn").onclick = () => openEditModal(user);
      row.querySelector(".delete-btn").onclick = () => deleteUser(user._id);
      adminBody.appendChild(row);
    } else if (user.userType === "user" || user.userType === "customer") {
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
      userBody.appendChild(row);
    }
  });
}

  async function loadUsers() {
    try {
      const res = await fetch("/admin/users");

      // Check if response is JSON and readable
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Expected JSON response");
      }

      const users = await res.json();

      if (!Array.isArray(users)) {
        throw new Error("Response is not a list of users");
      }

      renderUsers(users);
    } catch (err) {
      console.error("Error loading users:", err);
      alert("Error loading users: " + err.message);
    }
  }

  loadUsers();

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

    if (!firstName) { showError("firstName", "First name is required"); hasError = true; }
    if (!lastName) { showError("lastName", "Last name is required"); hasError = true; }
    if (!email) { showError("email", "Email is required"); hasError = true; }
    else if (!emailRegex.test(email)) { showError("email", "Invalid email format"); hasError = true; }
    if (!contact) { showError("contact", "Contact number is required"); hasError = true; }
    else if (!/^\d{11}$/.test(contact)) { showError("contact", "Must be 11 digits"); hasError = true; }
    if (!age || isNaN(age) || age < 18) { showError("age", "Must be 18 or older"); hasError = true; }
    if (!address) { showError("address", "Address is required"); hasError = true; }
    if (!userType) { showError("accountType", "Please select an account type"); hasError = true; }

    if (!isEditMode) {
      if (!password) { showError("password", "Password is required"); hasError = true; }
      if (!confirmPassword) { showError("confirmPassword", "Confirm your password"); hasError = true; }
      else if (password !== confirmPassword) { showError("confirmPassword", "Passwords do not match"); hasError = true; }
    }

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
      let res;
      if (isEditMode) {
        res = await fetch(`/admin/users/${editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch("/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }

      if (!res.ok) {
        const errorRes = await res.json();
        throw new Error(errorRes.message || "Failed to save user");
      }

      userModal.style.display = "none";
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Error saving user: " + err.message);
    }
  });

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

  async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/admin/users/${userId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete user");

      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  }

  userModal.addEventListener("click", () => {
    userModal.style.display = "none";
  });

  document.getElementById("modalContent").addEventListener("click", e => {
    e.stopPropagation();
  });

});


