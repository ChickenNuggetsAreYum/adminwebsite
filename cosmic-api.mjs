import { parseHTML } from 'linkedom'; // parse HTML server-side

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const DB = env.DB; // D1 database binding

    try {
      // -------------------
      // GET all items
      // -------------------
      if (url.pathname === "/api/items" && request.method === "GET") {
        await DB.prepare(`
          CREATE TABLE IF NOT EXISTS items (
            itemName TEXT PRIMARY KEY,
            priceDisplay TEXT,
            demand TEXT,
            category TEXT,
            status TEXT,
            thumbnail TEXT,
            updatedBy TEXT
          )
        `).run();

        const data = await DB.prepare(`SELECT * FROM items`).all();
        return new Response(JSON.stringify(data.results), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // -------------------
      // UPDATE single item
      // -------------------
      if (url.pathname === "/api/update" && request.method === "POST") {
        const body = await request.json();
        const { itemName, priceDisplay, demand, category, status, thumbnail, updatedBy } = body;

        await DB.prepare(`
          CREATE TABLE IF NOT EXISTS items (
            itemName TEXT PRIMARY KEY,
            priceDisplay TEXT,
            demand TEXT,
            category TEXT,
            status TEXT,
            thumbnail TEXT,
            updatedBy TEXT
          )
        `).run();

        await DB.prepare(`
          INSERT OR REPLACE INTO items
          (itemName, priceDisplay, demand, category, status, thumbnail, updatedBy)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(itemName, priceDisplay, demand, category, status, thumbnail || "", updatedBy || "admin").run();

        return new Response(JSON.stringify({ success: true, message: "Item updated" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // -------------------
      // SCRAPE GAME.GUIDE (Admin)
      // -------------------
      if (url.pathname === "/api/admin/scrape-gameguide" && request.method === "POST") {
        const scrapeRes = await fetch("https://www.game.guide/creatures-of-sonaria-value-list", {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        const html = await scrapeRes.text();

        const { document } = parseHTML(html);
        const rows = document.querySelectorAll("table tbody tr");

        const items = [];
        for (const row of rows) {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 8) {
            const itemName = cells[1].textContent.trim();
            const priceDisplay = cells[2].textContent.trim();
            const demand = cells[4].textContent.trim();
            const category = cells[5].textContent.trim();
            const status = cells[7].textContent.trim();
            const thumbnail = "";
            items.push({ itemName, priceDisplay, demand, category, status, thumbnail });
          }
        }

        await DB.prepare(`
          CREATE TABLE IF NOT EXISTS items (
            itemName TEXT PRIMARY KEY,
            priceDisplay TEXT,
            demand TEXT,
            category TEXT,
            status TEXT,
            thumbnail TEXT,
            updatedBy TEXT
          )
        `).run();

        // Override old items
        await DB.prepare(`DELETE FROM items`).run();
        for (const item of items) {
          await DB.prepare(`
            INSERT INTO items
            (itemName, priceDisplay, demand, category, status, thumbnail, updatedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(item.itemName, item.priceDisplay, item.demand, item.category, item.status, item.thumbnail, "scrape-bot").run();
        }

        return new Response(JSON.stringify({ success: true, totalScraped: items.length }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};