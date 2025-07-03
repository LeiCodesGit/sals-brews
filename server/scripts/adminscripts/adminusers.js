const userModal = document.getElementById("userModal");
const addUserBtn = document.getElementById("addUserBtn");
const closeModal = document.querySelector(".close");
const userForm = document.getElementById("userForm");
const adminTableBody = document.getElementById("adminTableBody");
const userTableBody = document.getElementById("userTableBody");
const modalTitle = document.getElementById("modalTitle");
const toast = document.getElementById("toast");

let editMode = false;
let editingRow = null;

addUserBtn.onclick = () => {
  userForm.reset();
  clearErrors();
  editMode = false;
  editingRow = null;
  modalTitle.textContent = "Add User";
  document.getElementById("accountType").disabled = false;
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

function showError(id, message) {
  const input = document.getElementById(id);
  const error = document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  error.style.color = "red";
  error.style.fontSize = "13px";
  error.style.marginTop = "4px";
  input.parentNode.insertBefore(error, input.nextSibling);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
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
  const age = document.getElementById("age").value.trim();
  const address = document.getElementById("address").value.trim();
  const accountType = document.getElementById("accountType").value;

  let isValid = true;

  if (!firstName) { showError("firstName", "First name is required."); isValid = false; }
  if (!lastName) { showError("lastName", "Last name is required."); isValid = false; }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    showError("email", "Enter a valid email.");
    isValid = false;
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!editMode || password || confirmPassword) {
    if (!password || !passwordPattern.test(password)) {
      showError("password", "Min 8 chars, 1 uppercase & number.");
      isValid = false;
    }

    if (!confirmPassword || password !== confirmPassword) {
      showError("confirmPassword", "Passwords must match.");
      isValid = false;
    }
  }

  const contactPattern = /^09\d{9}$/;
  if (!contact || !contactPattern.test(contact)) {
    showError("contact", "Must be like 09123456789.");
    isValid = false;
  }

  if (!age || parseInt(age) < 18) {
    showError("age", "Must be 18 or older.");
    isValid = false;
  }

  if (!address) {
    showError("address", "Address required.");
    isValid = false;
  }

  if (!accountType) {
    showError("accountType", "Choose account type.");
    isValid = false;
  }

  if (!isValid) return;

  const fullName = `${firstName} ${lastName}`;
  const isMainAdmin = email === "admin@salsbrews.com";

  const row = document.createElement("tr");
  if (accountType === "admin") {
    row.innerHTML = `
      <td>${fullName}</td>
      <td>${email}</td>
      <td>${contact}</td>
      <td>${isMainAdmin ? "Main Admin" : "Admin"}</td>
      <td>
        <button class="edit-btn">Edit</button>
        ${!isMainAdmin ? '<button class="delete-btn">Delete</button>' : ''}
      </td>
    `;
    if (isMainAdmin) row.classList.add("main-admin");
    row.querySelector(".edit-btn").onclick = () => loadUserForEdit(row, "admin");
    if (!isMainAdmin) row.querySelector(".delete-btn").onclick = () => row.remove();
    if (editMode && editingRow) editingRow.remove();
    adminTableBody.appendChild(row);
  } else {
    row.innerHTML = `
      <td>${fullName}</td>
      <td>${email}</td>
      <td>${contact}</td>
      <td>${age}</td>
      <td>${address}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
    row.querySelector(".edit-btn").onclick = () => loadUserForEdit(row, "user");
    row.querySelector(".delete-btn").onclick = () => row.remove();
    if (editMode && editingRow) editingRow.remove();
    userTableBody.appendChild(row);
  }

  showToast(editMode ? "User updated." : "User added.");
  userModal.style.display = "none";
  userForm.reset();
  editMode = false;
  editingRow = null;
});

function loadUserForEdit(row, type) {
  const cells = row.querySelectorAll("td");
  const [firstName, ...rest] = cells[0].textContent.split(" ");
  document.getElementById("firstName").value = firstName;
  document.getElementById("lastName").value = rest.join(" ");
  document.getElementById("email").value = cells[1].textContent;
  document.getElementById("contact").value = cells[2].textContent;
  document.getElementById("age").value = type === "user" ? cells[3].textContent : "25";
  document.getElementById("address").value = type === "user" ? cells[4].textContent : "N/A";
  document.getElementById("accountType").value = type;
  document.getElementById("accountType").disabled = true;
  document.getElementById("email").disabled = false;

  modalTitle.textContent = "Edit User";
  userModal.style.display = "flex";
  editMode = true;
  editingRow = row;
}
