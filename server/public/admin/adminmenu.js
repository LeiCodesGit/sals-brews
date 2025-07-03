const modal = document.getElementById("addItemModal");
const openBtn = document.getElementById("addItemBtn");
const closeBtn = document.querySelector(".close");

const categorySelect = document.getElementById("category");
const tempDiv = document.getElementById("tempOptions");
const sizeDiv = document.getElementById("sizeOptions");
const addonsDiv = document.getElementById("addonsDiv");

let editingItem = null;
let editingProductId = null;
let imagePreviewData = "";

// Modal open/close
openBtn.onclick = () => {
  resetForm();
  modal.style.display = "flex";
};

closeBtn.onclick = () => (modal.style.display = "none");

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Toggle options based on category
categorySelect.addEventListener("change", () => {
  const isPastry = categorySelect.value === "pastries";
  tempDiv.style.display = isPastry ? "none" : "block";
  sizeDiv.style.display = isPastry ? "none" : "block";
  addonsDiv.style.display = isPastry ? "none" : "block";
});

// Image preview
document.getElementById("image").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    imagePreviewData = e.target.result;
  };
  if (file) reader.readAsDataURL(file);
});

// Form submission
document.getElementById("menuForm").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("itemName").value;
  const category = categorySelect.value;
  const price = parseFloat(document.getElementById("price").value);

  const sizeMap = { "12 oz": 0, "14 oz": 15, "16 oz": 25 };
  const sizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(cb => ({
    label: cb.value,
    price: sizeMap[cb.value]
  }));

  const temperatures = Array.from(document.querySelectorAll('input[name="temperature"]:checked')).map(cb => cb.value);

  const addons = Array.from(document.querySelectorAll("#addonContainer .addon-group")).map(group => ({
    name: group.querySelector("input[type=text]").value,
    price: parseFloat(group.querySelector("input[type=number]").value)
  }));

  const productData = {
    product_name: name,
    product_image: imagePreviewData,
    category,
    price,
    isAvailable: true,
    isBestSeller: false,
    sizes,
    temperature_options: temperatures,
    addons
  };

  const fetchOptions = {
    method: editingProductId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData)
  };

  const url = editingProductId ? `/products/${editingProductId}` : "/products";

  fetch(url, fetchOptions)
    .then(res => res.json())
    .then(data => {
      alert(editingProductId ? "Product updated!" : "Product added!");
      modal.style.display = "none";
      loadMenuItems(); 
    })
    .catch(err => {
      console.error("Failed to save product:", err);
      alert("Something went wrong.");
    });

  this.reset();
  imagePreviewData = "";
  document.getElementById("addonContainer").innerHTML = "";
};

// Load menu items on page load
function loadMenuItems() {
  const sections = ["coffee", "non-coffee", "matcha", "pastries"];
  sections.forEach(section => {
    const container = document.getElementById(`${section}-items`);
    if (container) container.innerHTML = "";
  });

  fetch("/products")
    .then(res => res.json())
    .then(products => {
      products.forEach(product => renderProductCard(product));
    });
}

function renderProductCard(product) {
  const container = document.getElementById(`${product.category}-items`);
  if (!container) return;

  const card = document.createElement("div");
  card.className = "menu-item";

  const img = document.createElement("img");
  img.src = product.product_image || "../../assets/default-placeholder.png";
  img.alt = product.product_name;

  const title = document.createElement("h3");
  title.textContent = product.product_name;

  const categoryTag = document.createElement("p");
  categoryTag.textContent = product.category;

  const sizeText = product.sizes?.map(s => `${s.label} (+₱${s.price})`).join(", ") || "N/A";
  const sizeTag = document.createElement("p");
  sizeTag.textContent = `Sizes: ${sizeText}`;

  const priceTag = document.createElement("span");
  priceTag.className = "price";
  priceTag.textContent = `₱${product.price}`;

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";
  removeBtn.onclick = (e) => {
    e.stopPropagation();
    if (confirm("Delete this product?")) {
      fetch(`/products/${product._id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
          card.remove();
        });
    }
  };

  card.onclick = () => editItem(product);

  card.append(img, title, categoryTag, sizeTag, priceTag, removeBtn);
  container.appendChild(card);
}

// Edit existing product
function editItem(product) {
  document.getElementById("modalTitle").textContent = "Edit Menu Item";
  document.getElementById("itemName").value = product.product_name;
  document.getElementById("price").value = product.price;
  categorySelect.value = product.category;
  imagePreviewData = product.product_image;
  editingProductId = product._id;

  document.querySelectorAll('input[name="size"]').forEach(cb => {
    cb.checked = product.sizes?.some(s => s.label === cb.value);
  });

  document.querySelectorAll('input[name="temperature"]').forEach(cb => {
    cb.checked = product.temperature_options?.includes(cb.value);
  });

  document.getElementById("addonContainer").innerHTML = "";
  product.addons?.forEach(a => addAddon(a.name, a.price));

  categorySelect.dispatchEvent(new Event("change"));
  modal.style.display = "flex";
}

// Add an add-on row
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

  group.append(nameInput, priceInput);
  container.appendChild(group);
}

// Reset form and state
function resetForm() {
  document.getElementById("modalTitle").textContent = "Add Menu Item";
  document.getElementById("menuForm").reset();
  document.getElementById("addonContainer").innerHTML = "";
  editingItem = null;
  editingProductId = null;
  imagePreviewData = "";
}

// Initialize
loadMenuItems();
