const API_BASE = "https://cosmic-api.jeoliver1fan.workers.dev";

const tableBody = document.querySelector("#itemsTable tbody");
const scrapeBtn = document.getElementById("scrapeBtn");
const addBtn = document.getElementById("addBtn");

async function fetchItems() {
  const res = await fetch(`${API_BASE}/api/items`);
  const items = await res.json();
  tableBody.innerHTML = "";
  items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.itemName}</td>
      <td>${item.priceDisplay}</td>
      <td>${item.demand}</td>
      <td>${item.updatedBy}</td>
      <td>
        <button onclick='editItem("${item.itemName}")'>Edit</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

async function scrapeGameGuide() {
  scrapeBtn.disabled = true;
  scrapeBtn.textContent = "Scraping...";
  const res = await fetch(`${API_BASE}/api/admin/scrape-gameguide`, { method: "POST" });
  const data = await res.json();
  alert(`Scraped ${data.totalScraped} items!`);
  scrapeBtn.disabled = false;
  scrapeBtn.textContent = "Scrape Game.Guide";
  fetchItems();
}

async function editItem(itemName) {
  const price = prompt("New Price for " + itemName);
  if (price === null) return;
  const demand = prompt("New Demand for " + itemName);
  if (demand === null) return;

  await fetch(`${API_BASE}/api/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemName, priceDisplay: price, demand, updatedBy: "admin" }),
  });

  fetchItems();
}

async function addNewItem() {
  const name = prompt("Item Name");
  if (!name) return;
  const price = prompt("Price");
  if (price === null) return;
  const demand = prompt("Demand");
  if (demand === null) return;

  await fetch(`${API_BASE}/api/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemName: name, priceDisplay: price, demand, updatedBy: "admin" }),
  });

  fetchItems();
}

scrapeBtn.addEventListener("click", scrapeGameGuide);
addBtn.addEventListener("click", addNewItem);

fetchItems();