const API_BASE = "https://cosmic-api.jeoliver1fan.workers.dev";

const tableBody = document.querySelector("#itemsTable tbody");
const scrapeBtn = document.getElementById("scrapeBtn");

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
      <td>${item.category}</td>
      <td>${item.status}</td>
      <td><button onclick='updateItem("${item.itemName}")'>Update</button></td>
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

async function updateItem(itemName) {
  const newPrice = prompt("Enter new price for " + itemName);
  if (!newPrice) return;
  const res = await fetch(`${API_BASE}/api/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemName, priceDisplay: newPrice }),
  });
  const data = await res.json();
  alert(data.message);
  fetchItems();
}

scrapeBtn.addEventListener("click", scrapeGameGuide);
fetchItems();