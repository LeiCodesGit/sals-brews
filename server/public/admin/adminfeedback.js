// Sample data only
const feedbackData = [
  {
    orderId: "ORD001",
    customer: "Andrea Tan",
    date: "2025-07-01",
    rating: 5,
    message: "Loved the matcha latte! Will definitely order again."
  },
  {
    orderId: "ORD002",
    customer: "Leah Cruzo",
    date: "2025-07-01",
    rating: 3.5,
    message: "The coffee was okay. The packaging wasn't that secure though, please check next time!"
  },
  {
    orderId: "ORD003",
    customer: "Sophia Managbanag",
    date: "2025-07-01",
    rating: 4,
    message: "Great experience overall, the delivery was fast."
  }
];

const feedbackBody = document.getElementById("feedbackBody");
const modal = document.getElementById("feedbackModal");
const closeModal = document.querySelector(".close");

feedbackData.forEach(item => {
  const row = document.createElement("tr");

  const stars = createStars(item.rating);

  row.innerHTML = `
    <td>${item.orderId}</td>
    <td>${item.customer}</td>
    <td>${item.date}</td>
    <td>${stars}</td>
    <td>${truncate(item.message, 50)}</td>
    <td><button class="view-btn">View</button></td>
  `;

  row.querySelector(".view-btn").addEventListener("click", () => {
    document.getElementById("modalCustomer").textContent = item.customer;
    document.getElementById("modalOrderId").textContent = item.orderId;
    document.getElementById("modalDate").textContent = item.date;
    document.getElementById("modalRating").textContent = createStars(item.rating);
    document.getElementById("modalMessage").textContent = item.message;
    modal.style.display = "flex";
  });

  feedbackBody.appendChild(row);
});

function createStars(rating) {
  const max = 5;
  let stars = "";

  for (let i = 1; i <= max; i++) {
    if (rating >= i) {
      stars += "★"; 
    } else if (rating >= i - 0.5) {
      stars += "⯨"; 
    } else {
      stars += "☆"; 
    }
  }

  return stars;
}

function truncate(text, limit) {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};
