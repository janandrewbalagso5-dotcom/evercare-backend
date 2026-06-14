import { Router } from "express";
import { db, isMock } from "../firebase/admin.js";
import { mockStore, writeMockLog } from "../firebase/mockData.js";

const router = Router();

// GET /api/doctors  — get all doctors
router.get("/", async (req, res) => {
  try {
    if (isMock) {
      return res.json(mockStore.doctors);
    }

    const snapshot = await db.collection("doctors").get();
    return res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/doctors/:id/availability  — update doctor availability
router.patch("/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  if (!availability) {
    return res.status(400).json({ error: "availability field is required" });
  }

  try {
    if (isMock) {
      const index = mockStore.doctors.findIndex((d) => d.id === id);
      if (index === -1) return res.status(404).json({ error: "Doctor not found" });
      mockStore.doctors[index].availability = availability;
      writeMockLog(id, "Schedule Update", "Doctor updated operational availability.");
      return res.json(mockStore.doctors[index]);
    }

    await db.collection("doctors").doc(id).update({ availability });
    return res.json({ id, availability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
