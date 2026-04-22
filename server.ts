import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import admin from 'firebase-admin';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();
// Use the specific database ID from config if provided
const firestoreDb = firebaseConfig.firestoreDatabaseId 
  ? admin.firestore().getFirestore(firebaseConfig.firestoreDatabaseId)
  : admin.firestore();

const INVOICES_COLLECTION = 'invoices';

const app = express();
app.use(express.json());

// API Routes using Firestore
app.get("/api/invoices", async (req, res) => {
  try {
    const snapshot = await db.collection(INVOICES_COLLECTION).get();
    const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

app.post("/api/invoices", async (req, res) => {
  try {
    const newInvoice = req.body;
    const { id, ...invoiceData } = newInvoice;
    // We use the custom ID (e.g. RT3080) as the document ID
    await db.collection(INVOICES_COLLECTION).doc(id).set(invoiceData);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error saving invoice:", error);
    res.status(500).json({ error: "Failed to save invoice" });
  }
});

app.put("/api/invoices/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(INVOICES_COLLECTION).doc(id).update(req.body);
    const updated = await db.collection(INVOICES_COLLECTION).doc(id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(404).json({ error: "Invoice not found or failed to update" });
  }
});

app.delete("/api/invoices/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(INVOICES_COLLECTION).doc(id).delete();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});

async function startServer() {
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

  // Only listen if explicitly called (not during Vercel function import)
  if (process.env.PORT || process.argv.includes("--listen") || process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n  🚀  Invoice App is running with Firebase Cloud Storage!`);
      console.log(`  ➜  Local:   http://localhost:${PORT}`);
      console.log(`  ➜  Network: http://0.0.0.0:${PORT}\n`);
    });
  }
}

startServer();

export default app;
