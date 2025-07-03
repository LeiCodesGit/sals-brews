const ordersTableBody = document.querySelector("#ordersTable tbody");
const historyTableBody = document.querySelector("#historyTable tbody");

// Sample dummy data (replace with backend data later)
let orders = [
  {
    id: "ORD001",
    user: "andrea@example.com",
    items: "2x Caramel Latte, 1x Croissant",
    total: "₱350",
    status: "Pending",
    date: new Date().toLocaleString()
  },
  {
    id: "ORD002",
    user: "john@brewmail.com",
    items: "1x Matcha Frappe",
    total: "₱180",
    status: "Pending",
    date: new Date().toLocaleString()
  }
];

let history = [];

function renderOrders() {
  ordersTableBody.innerHTML = "";

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `<tr><td colspan="6" class="empty">No active orders</td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.user}</td>
      <td>${order.items}</td>
      <td>${order.total}</td>
      <td>${order.status}</td>
      <td>
        <button class="action-btn confirm" onclick="confirmOrder(${index})">Confirm</button>
        <button class="action-btn cancel" onclick="cancelOrder(${index})">Cancel</button>
        <button class="action-btn delete" onclick="deleteOrder(${index})">Delete</button>
      </td>
    `;

    ordersTableBody.appendChild(row);
  });
}

function renderHistory() {
  historyTableBody.innerHTML = "";

  if (history.length === 0) {
    historyTableBody.innerHTML = `<tr><td colspan="6" class="empty">No history available</td></tr>`;
    return;
  }

  history.forEach(order => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.user}</td>
      <td>${order.items}</td>
      <td>${order.total}</td>
      <td>${order.status}</td>
      <td>${order.date}</td>
    `;

    historyTableBody.appendChild(row);
  });
}

function confirmOrder(index) {
  const order = orders[index];
  order.status = "Completed";
  order.date = new Date().toLocaleString();
  history.push(order);
  orders.splice(index, 1);
  renderOrders();
  renderHistory();
}

function cancelOrder(index) {
  const order = orders[index];
  order.status = "Cancelled";
  order.date = new Date().toLocaleString();
  history.push(order);
  orders.splice(index, 1);
  renderOrders();
  renderHistory();
}

function deleteOrder(index) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders.splice(index, 1);
    renderOrders();
  }
}

// Initial render
renderOrders();
renderHistory();
