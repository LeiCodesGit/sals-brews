const ordersTableBody = document.querySelector("#ordersTable tbody");
const historyTableBody = document.querySelector("#historyTable tbody");

let orders = [];
let history = [];

async function fetchOrders() {
  try {
    const res = await axios.get("/admin/orders"); // backend route
    const data = res.data;

    orders = data.orders.filter(order => order.status === "Pending" || order.status === "Preparing");
    history = data.orders.filter(order => order.status !== "Pending" && order.status !== "Preparing");

    renderOrders();
    renderHistory();
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    ordersTableBody.innerHTML = `<tr><td colspan="6" class="empty">Error loading orders</td></tr>`;
    historyTableBody.innerHTML = `<tr><td colspan="6" class="empty">Error loading history</td></tr>`;
  }
}

function renderOrders() {
  ordersTableBody.innerHTML = "";

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `<tr><td colspan="6" class="empty">No active orders</td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order._id}</td>
      <td>${order.user_email}</td>
      <td>${order.items.map(i => `${i.quantity}x ${i.productName || i.productId?.product_name || "Unknown Item"}`).join(", ")}</td>
      <td>₱${order.total_price.toFixed(2)}</td>
      <td>${order.status}</td>
      <td>
        <button class="action-btn confirm" onclick="confirmOrder('${order._id}')">Confirm</button>
        <button class="action-btn cancel" onclick="cancelOrder('${order._id}')">Cancel</button>
        <button class="action-btn delete" onclick="deleteOrder('${order._id}')">Delete</button>
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
      <td>${order._id}</td>
      <td>${order.user_email}</td>
      <td>${order.items.map(i => `${i.quantity}x ${i.productName || i.productId?.product_name || "Unknown Item"}`).join(", ")}</td>
      <td>₱${order.total_price.toFixed(2)}</td>
      <td>${order.status}</td>
      <td>${new Date(order.order_date).toLocaleString()}</td>
    `;

    historyTableBody.appendChild(row);
  });
}

// Backend updates
async function confirmOrder(orderId) {
  await updateOrderStatus(orderId, "Completed");
}

async function cancelOrder(orderId) {
  await updateOrderStatus(orderId, "Cancelled");
}

async function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  try {
    await axios.delete(`/admin/orders/${orderId}`);
    await fetchOrders();
  } catch (err) {
    alert("Failed to delete order");
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await axios.put(`/admin/orders/${orderId}`, { status });
    await fetchOrders();
  } catch (err) {
    alert("Failed to update order");
  }
}

// Initial load
fetchOrders();
