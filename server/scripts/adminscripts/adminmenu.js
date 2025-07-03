const modal = document.getElementById("addItemModal");
const openBtn = document.getElementById("addItemBtn");
const closeBtn = document.querySelector(".close");

const categorySelect = document.getElementById("category");
const tempDiv = document.getElementById("tempOptions");
const sizeDiv = document.getElementById("sizeOptions");
const addonsDiv = document.getElementById("addonsDiv");

let editingItem = null;
let imagePreviewData = "";

openBtn.onclick = () => {
  resetForm();
  modal.style.display = "flex";
};

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

categorySelect.addEventListener("change", () => {
  const isPastry = categorySelect.value === "pastries";
  tempDiv.style.display = isPastry ? "none" : "block";
  sizeDiv.style.display = isPastry ? "none" : "block";
  addonsDiv.style.display = isPastry ? "none" : "block";
});

document.getElementById("image").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    imagePreviewData = e.target.result;
  };
  if (file) reader.readAsDataURL(file);
});

document.getElementById("menuForm").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("itemName").value;
  const category = categorySelect.value;
  const price = document.getElementById("price").value;
  const sizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(cb => cb.value);
  const temperatures = Array.from(document.querySelectorAll('input[name="temperature"]:checked')).map(cb => cb.value);
  const addons = Array.from(document.querySelectorAll("#addonContainer .addon-group")).map(group => ({
    name: group.querySelector("input[type=text]").value,
    price: group.querySelector("input[type=number]").value
  }));

  const itemCard = document.createElement("div");
  itemCard.className = "menu-item";

  const img = document.createElement("img");
  img.src = imagePreviewData || "../../assets/default-placeholder.png";
  img.alt = name;

  const title = document.createElement("h3");
  title.textContent = name;

  const categoryTag = document.createElement("p");
  categoryTag.textContent = category;

  const sizeTag = document.createElement("p");
  sizeTag.textContent = "Sizes: " + (sizes.length ? sizes.join(", ") : "N/A");

  const priceTag = document.createElement("span");
  priceTag.className = "price";
  priceTag.textContent = `₱${price}`;

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";
  removeBtn.onclick = (e) => {
    e.stopPropagation();
    itemCard.remove();
  };

  itemCard.appendChild(img);
  itemCard.appendChild(title);
  itemCard.appendChild(categoryTag);
  itemCard.appendChild(sizeTag);
  itemCard.appendChild(priceTag);
  itemCard.appendChild(removeBtn);

  itemCard.onclick = () => editItem({ name, category, price, sizes, temperatures, addons, image: imagePreviewData });

  const container = document.getElementById(`${category}-items`);
  if (!editingItem) {
    container.appendChild(itemCard);
  } else {
    editingItem.replaceWith(itemCard);
    editingItem = null;
  }

  modal.style.display = "none";
  this.reset();
  imagePreviewData = "";
  document.getElementById("addonContainer").innerHTML = "";
};

function addAddon(name = "", price = "") {
  const container = document.getElementById("addonContainer");
  const group = document.createElement("div");
  group.className = "addon-group";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Add-on Name";
  nameInput.value = name;

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.placeholder = "₱";
  priceInput.value = price;

  group.appendChild(nameInput);
  group.appendChild(priceInput);
  container.appendChild(group);
}

function editItem(item) {
  document.getElementById("modalTitle").textContent = "Edit Menu Item";
  document.getElementById("itemName").value = item.name;
  categorySelect.value = item.category;
  document.getElementById("price").value = item.price;
  imagePreviewData = item.image || "";

  document.querySelectorAll('input[name="size"]').forEach(cb => {
    cb.checked = item.sizes.includes(cb.value);
  });

  document.querySelectorAll('input[name="temperature"]').forEach(cb => {
    cb.checked = item.temperatures.includes(cb.value);
  });

  document.getElementById("addonContainer").innerHTML = "";
  item.addons.forEach(a => addAddon(a.name, a.price));

  categorySelect.dispatchEvent(new Event("change"));
  editingItem = event.currentTarget;
  modal.style.display = "flex";
}

function resetForm() {
  document.getElementById("modalTitle").textContent = "Add Menu Item";
  document.getElementById("menuForm").reset();
  document.getElementById("addonContainer").innerHTML = "";
  editingItem = null;
  imagePreviewData = "";
}
