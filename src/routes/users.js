import { Router } from "express";
import { db, isMock } from "../firebase/admin.js";
import { mockStore, writeMockLog } from "../firebase/mockData.js";

const router = Router();

// GET /api/users?email=xxx  — get user by email
router.get("/", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email query param required" });

  try {
    if (isMock) {
      const user = mockStore.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      return res.json(user || null);
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", email.toLowerCase())
      .get();

    if (snapshot.empty) return res.json(null);
    const doc = snapshot.docs[0];
    return res.json({ uid: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/patients  — get all patients
router.get("/patients", async (req, res) => {
  try {
    if (isMock) {
      return res.json(mockStore.users.filter((u) => u.role === "patient"));
    }

    const snapshot = await db
      .collection("users")
      .where("role", "==", "patient")
      .get();

    return res.json(snapshot.docs.map((d) => ({ uid: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users  — create user
router.post("/", async (req, res) => {
  const userData = req.body;
  if (!userData.email || !userData.name) {
    return res.status(400).json({ error: "email and name are required" });
  }

  try {
    if (isMock) {
      const exists = mockStore.users.some(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );
      if (exists) return res.status(409).json({ error: "Email already exists" });

      const newUser = {
        uid: userData.uid || "usr_" + Date.now(),
        twoFactorEnabled: false,
        twoFactorSecret: Math.floor(100000 + Math.random() * 900000).toString(),
        ...userData,
      };
      mockStore.users.push(newUser);
      writeMockLog(userData.email, "User Registration", `New ${userData.role} registered: ${userData.name}`);
      return res.status(201).json(newUser);
    }

    const uid = userData.uid || "usr_" + Date.now();
    const data = {
      twoFactorEnabled: false,
      twoFactorSecret: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString(),
      ...userData,
      uid,
    };
    await db.collection("users").doc(uid).set(data);
    return res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:uid  — update user
router.patch("/:uid", async (req, res) => {
  const { uid } = req.params;
  const updates = req.body;

  try {
    if (isMock) {
      const index = mockStore.users.findIndex((u) => u.uid === uid);
      if (index === -1) return res.status(404).json({ error: "User not found" });
      mockStore.users[index] = { ...mockStore.users[index], ...updates };
      writeMockLog(mockStore.users[index].email, "Profile Updated", "User information updated.");
      return res.json(mockStore.users[index]);
    }

    await db.collection("users").doc(uid).update(updates);
    return res.json({ uid, ...updates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
