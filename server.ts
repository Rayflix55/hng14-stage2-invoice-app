import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "data.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize DB if not exists
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify([]));
  }

  // API Routes
  app.get("/api/invoices", async (req, res) => {
    const data = await fs.readFile(DB_FILE, "utf-8");
    res.json(JSON.parse(data));
  });

  app.post("/api/invoices", async (req, res) => {
    const data = JSON.parse(await fs.readFile(DB_FILE, "utf-8"));
    const newInvoice = req.body;
    data.push(newInvoice);
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newInvoice);
  });

  app.put("/api/invoices/:id", async (req, res) => {
    const { id } = req.params;
    let data = JSON.parse(await fs.readFile(DB_FILE, "utf-8"));
    const index = data.findIndex((inv: any) => inv.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
      res.json(data[index]);
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    const { id } = req.params;
    let data = JSON.parse(await fs.readFile(DB_FILE, "utf-8"));
    data = data.filter((inv: any) => inv.id !== id);
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
