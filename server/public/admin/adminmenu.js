
window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("addItemModal");
  const openBtn = document.getElementById("addItemBtn");
  const closeBtn = document.querySelector(".close");

  const categorySelect = document.getElementById("category");
  const tempDiv = document.getElementById("tempOptions");
  const sizeDiv = document.getElementById("sizeOptions");
  const addonsDiv = document.getElementById("addonsDiv");

  let editingItem = null;
  let imagePreviewData = "";

  // Show modal
  openBtn.onclick = () => {
    resetForm();
    modal.style.display = "flex";
  };

  // Close modal
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  // Toggle input groups based on category
  categorySelect.addEventListener("change", () => {
    const isPastry = categorySelect.value === "pastries";
    tempDiv.style.display = isPastry ? "none" : "block";
    sizeDiv.style.display = isPastry ? "none" : "block";
    addonsDiv.style.display = isPastry ? "none" : "block";
  });

  document.getElementById("image").addEventListener("change", async function () {
  const file = this.files[0];
  if (!file) return;

  try {
    imagePreviewData = await convertImageToBase64(file);
    console.log("Base64 image preview ready");
  } catch (err) {
    console.error(err);
    alert("Failed to read image file.");
  }
});

  // Submit form
  document.getElementById("menuForm").onsubmit = async function (e) {
    e.preventDefault();

    const name = document.getElementById("itemName").value;
    const category = categorySelect.value;
    const price = parseFloat(document.getElementById("price").value);

    const sizeMap = {
      "12oz": 0,
      "14oz": 15,
      "16oz": 25
    };

    const sizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(cb => ({
      label: cb.value,
      price: sizeMap[cb.value] || 0
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
      sizes,
      temperature_options: temperatures,
      addons,
      isAvailable: true,
      isBestSeller: false
    };

    try {
  const res = await axios.post("/products", productData);

  if (res.status === 201) {
    alert("Product added successfully!");
    addItemCard(res.data.product);
    modal.style.display = "none";
    this.reset();
    imagePreviewData = "";
    document.getElementById("addonContainer").innerHTML = "";
  } else {
    alert(res.data.message || "Unexpected response from server.");
    console.warn("Unexpected Axios response:", res);
  }

} catch (err) {
  console.error("Axios POST Error:", err);

  if (err.response) {
    // Server responded with a status outside 2xx
    console.error("Server Response:", err.response);
    console.error("Status Code:", err.response.status);
    console.error("Response Data:", err.response.data);

    alert(
      `Failed to add product.\n` +
      `Status: ${err.response.status}\n` +
      `Message: ${err.response.data?.message || "No message"}\n` +
      `Details: ${err.response.data?.error || "No details"}`
    );

  } else if (err.request) {
    // No response received
    console.error("No response from server. Request details:", err.request);
    alert("No response from server. Check your internet connection or backend.");
  } else {
    // Error setting up the request
    console.error("Request Setup Error:", err.message);
    alert(`Request setup failed: ${err.message}`);
  }
}

  };

  // Create card in DOM
  function addItemCard(item) {
    const itemCard = document.createElement("div");
    itemCard.className = "menu-item";

    const img = document.createElement("img");
    img.src = item.product_image || "/assets/default-placeholder.png";
    img.alt = item.product_name;

    const title = document.createElement("h3");
    title.textContent = item.product_name;

    const categoryTag = document.createElement("p");
    categoryTag.textContent = item.category;

    const sizeTag = document.createElement("p");
    sizeTag.textContent = "Sizes: " + (item.sizes?.length
      ? item.sizes.map(s => `${s.label} (+₱${s.price})`).join(", ")
      : "N/A");

    const priceTag = document.createElement("span");
    priceTag.className = "price";
    priceTag.textContent = `₱${item.price}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = async (e) => {
      e.stopPropagation();
      if (!confirm("Are you sure you want to delete this item?")) return;
      try {
        const res = await axios.delete(`/products/${item._id}`);
        if (res.status === 200) {
          itemCard.remove();
        } else {
          alert("Failed to delete item.");
        }
      } catch (err) {
        alert("Error deleting product.");
      }
    };

    itemCard.appendChild(img);
    itemCard.appendChild(title);
    itemCard.appendChild(categoryTag);
    itemCard.appendChild(sizeTag);
    itemCard.appendChild(priceTag);
    itemCard.appendChild(removeBtn);

    const container = document.getElementById(`${item.category}-items`);
    container.appendChild(itemCard);
  }

  // Add-ons
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

    // Reset modal
    function resetForm() {
      document.getElementById("modalTitle").textContent = "Add Menu Item";
      document.getElementById("menuForm").reset();
      document.getElementById("addonContainer").innerHTML = "";
      editingItem = null;
      imagePreviewData = "";
  }

  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (event) {
        resolve(event.target.result); // Base64 string
      };

      reader.onerror = function (error) {
        reject("Error converting image to Base64: " + error);
      };
      reader.readAsDataURL(file); // Triggers base64 conversion
    });
  }

  (async function loadAllProducts() {
    try {
        const res = await axios.get("/products");
        const products = res.data;

        if (Array.isArray(products)) {
          products.forEach(addItemCard);
        } else {
          console.warn("Unexpected response format:", products);
        }
    } catch (err) {
      console.error("Failed to fetch products:", err);

      if (err.response) {
        alert(`Failed to load products.\nStatus: ${err.response.status}\nMessage: ${err.response.data?.message}`);
      } else {
        alert("Failed to load products. Check your connection or server.");
      }
      }
  })();


  loadAllProducts().catch(err => {
    console.error("Error loading products:", err);
    alert("Failed to load products. Please try again later.");
  });
});