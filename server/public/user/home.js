document.addEventListener("DOMContentLoaded", async () => {
  const categories = ['coffee', 'non-coffee', 'pastries'];
  let currentIndex = 0;

  function updateMenuDisplay() {
    categories.forEach((id, index) => {
      document.getElementById(id).classList.toggle('hidden', index !== currentIndex);
    });

    const tabs = document.querySelectorAll('.tabs .tab');
    tabs.forEach((tab, index) => {
      tab.classList.toggle('active', index === currentIndex);
    });
  }

  document.querySelectorAll('.tabs .tab').forEach((tab, index) => {
    tab.addEventListener('click', () => {
      currentIndex = index;
      updateMenuDisplay();
    });
  });

  updateMenuDisplay();

  try {
    const res = await axios.get("/products");
    const products = res.data;

    products.forEach(item => {
      const card = createMenuItemCard(item);

      if (item.isBestSeller) {
        document.getElementById("best-sellers").appendChild(card);
      }

      const section = document.getElementById(item.category);
      if (section) section.appendChild(card.cloneNode(true));
    });
  } catch (err) {
    console.error("Failed to fetch products:", err);
    alert("Unable to load menu. Please try again later.");
  }

  function createMenuItemCard(item) {
    const div = document.createElement("div");
    div.className = "menu-item";

    const img = document.createElement("img");
    img.src = item.product_image || "/assets/default-placeholder.png";
    img.alt = item.product_name;

    const name = document.createElement("p");
    name.textContent = item.product_name;

    const price = document.createElement("p");
    price.style.paddingTop = "18px";
    price.textContent = `₱${item.price}`;

    const btn = document.createElement("a");
    btn.className = "buy-btn";
    btn.href = `/itempage/${item._id}`;
    btn.textContent = "BUY NOW";

    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(price);
    div.appendChild(btn);

    return div;
  }
});
