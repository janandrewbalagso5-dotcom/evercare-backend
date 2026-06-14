import "dotenv/config";
import express from "express";
import usersRouter from "./routes/users.js";
import doctorsRouter from "./routes/doctors.js";
import appointmentsRouter from "./routes/appointments.js";
import transactionsRouter from "./routes/transactions.js";
import systemRouter from "./routes/system.js";
import { isMock } from "./supabase/client.js";
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Manual CORS headers (Vercel-safe) ───────────────────────
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Respond immediately to preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ─── Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "EverCare API",
    mode: isMock ? "mock" : "supabase",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/users", usersRouter);
app.use("/api/doctors", doctorsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/system", systemRouter);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Error Handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\nEverCare API running on http://localhost:${PORT}`);
    console.log(`Mode: ${isMock ? "Mock (in-memory)" : "Firebase Firestore"}`);
    console.log(`Health check: http://localhost:${PORT}/\n`);
  });
}
