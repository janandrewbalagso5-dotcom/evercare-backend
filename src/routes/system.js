import { Router } from "express";
import { db, isMock } from "../firebase/admin.js";
import { mockStore, writeMockLog, DEFAULT_DOCTORS, DEFAULT_USERS, DEFAULT_APPOINTMENTS, DEFAULT_TRANSACTIONS, DEFAULT_LOGS, DEFAULT_SETTINGS } from "../firebase/mockData.js";

const router = Router();

// GET /api/system/logs
router.get("/logs", async (req, res) => {
  try {
    if (isMock) {
      return res.json(mockStore.logs);
    }

    const snapshot = await db
      .collection("logs")
      .orderBy("timestamp", "desc")
      .get();

    return res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/system/logs  — write a log entry
router.post("/logs", async (req, res) => {
  const { email, action, details } = req.body;
  if (!email || !action) {
    return res.status(400).json({ error: "email and action are required" });
  }

  try {
    if (isMock) {
      writeMockLog(email, action, details || "");
      return res.status(201).json({ success: true });
    }

    await db.collection("logs").add({
      timestamp: new Date().toISOString(),
      userEmail: email,
      action,
      details: details || "",
    });
    return res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/system/settings
router.get("/settings", async (req, res) => {
  try {
    if (isMock) {
      return res.json(mockStore.settings);
    }

    const docSnap = await db.collection("settings").doc("global").get();
    return res.json(docSnap.exists ? docSnap.data() : DEFAULT_SETTINGS);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/system/settings
router.put("/settings", async (req, res) => {
  const settings = req.body;

  try {
    if (isMock) {
      mockStore.settings = { ...mockStore.settings, ...settings };
      writeMockLog("admin@evercare.com", "Settings Changed", "System-wide settings updated.");
      return res.json(mockStore.settings);
    }

    await db.collection("settings").doc("global").set(settings);
    return res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/system/reset  — reset mock database
router.post("/reset", (req, res) => {
  if (!isMock) {
    return res.status(400).json({ error: "Reset only available in mock mode" });
  }

  mockStore.doctors = JSON.parse(JSON.stringify(DEFAULT_DOCTORS));
  mockStore.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
  mockStore.appointments = JSON.parse(JSON.stringify(DEFAULT_APPOINTMENTS));
  mockStore.transactions = JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));
  mockStore.logs = JSON.parse(JSON.stringify(DEFAULT_LOGS));
  mockStore.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

  writeMockLog("system@evercare.com", "Database Reset", "System database restored from clean backup.");
  return res.json({ success: true });
});

// GET /api/system/backup
router.get("/backup", (req, res) => {
  if (!isMock) {
    return res.json({ message: "Firebase backups should be accessed via Firebase Console." });
  }

  return res.json({
    ...mockStore,
    timestamp: new Date().toISOString(),
  });
});

export default router;
