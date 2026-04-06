const API_BASE = "https://cosmic-api.jeoliver1fan.workers.dev";

const tableBody = document.querySelector("#itemsTable tbody");
const refreshBtn = document.getElementById("refreshBtn");
const addNewBtn = document.getElementById("addNewBtn");

// Fetch and display items
async function loadItems() {
  const res = await fetch(`${API_BASE}/api/items`);
  const items = await res.json();

  tableBody.innerHTML = "";
  items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.itemName}</td>
      <td>${item.priceDisplay}</td>
      <td>${item.demand}</td>
      <td>
        <button onclick='editItem("${item.itemName}", "${item.priceDisplay}", "${item.demand}")'>Edit</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Edit handler
function editItem(name, price, demand) {
  const newName = prompt("Edit name:", name);
  if (newName === null) return;

  const newPrice = prompt("Edit price:", price);
  if (newPrice === null) return;

  const newDemand = prompt("Edit demand:", demand);
  if (newDemand === null) return;

  fetch(`${API_BASE}/api/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itemName: newName,
      priceDisplay: newPrice,
      demand: newDemand,
      updatedBy: "admin"
    })
  }).then(() => loadItems());
}

// Add new item
addNewBtn.addEventListener("click", () => {
  const name = prompt("New item name:");
  if (!name) return;

  const price = prompt("Enter price:");
  if (price === null) return;

  const demand = prompt("Enter demand:");
  if (demand === null) return;

  fetch(`${API_BASE}/api/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itemName: name,
      priceDisplay: price,
      demand,
      updatedBy: "admin"
    })
  }).then(() => loadItems());
});

// Refresh list
refreshBtn.addEventListener("click", loadItems);

// Load on open
loadItems();