const API = "https://cosmic-api.jeoliver1fan.workers.dev";

document.getElementById("scrapeBtn").addEventListener("click", scrape);
document.getElementById("saveBtn").addEventListener("click", save);

async function scrape() {
  try {
    const res = await fetch(API + "/api/admin/scrape-gameguide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updatedBy: "admin-panel" })
    });
    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err;
  }
}

async function save() {
  const payload = {
    itemName: document.getElementById("name").value,
    category: document.getElementById("category").value,
    priceDisplay: document.getElementById("price").value,
    demand: document.getElementById("demand").value,
    status: document.getElementById("status").value,
    thumbnail: document.getElementById("thumb").value,
    updatedBy: document.getElementById("by").value || "admin-panel"
  };

  try {
    const res = await fetch(API + "/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err;
  }
}