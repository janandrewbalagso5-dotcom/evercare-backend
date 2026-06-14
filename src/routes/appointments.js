import { Router } from "express";
import { db, isMock } from "../firebase/admin.js";
import { mockStore, writeMockLog } from "../firebase/mockData.js";

const router = Router();

// GET /api/appointments  — get all appointments
router.get("/", async (req, res) => {
  try {
    if (isMock) {
      return res.json(mockStore.appointments);
    }

    const snapshot = await db
      .collection("appointments")
      .orderBy("date", "asc")
      .get();

    return res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appointments  — book appointment
router.post("/", async (req, res) => {
  const appointmentData = req.body;

  const newApt = {
    id: "apt_" + Date.now(),
    status: "Pending",
    paymentStatus: "Unpaid",
    prescription: "",
    notes: "",
    updatedAt: new Date().toISOString(),
    ...appointmentData,
  };

  try {
    if (isMock) {
      mockStore.appointments.unshift(newApt);
      writeMockLog(
        appointmentData.patientName,
        "Appointment Booked",
        `Booked with ${appointmentData.doctorName} for ${appointmentData.date}`
      );
      return res.status(201).json(newApt);
    }

    await db.collection("appointments").doc(newApt.id).set({
      ...newApt,
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json(newApt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/appointments/:id  — update appointment status/notes/prescription
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (isMock) {
      const index = mockStore.appointments.findIndex((a) => a.id === id);
      if (index === -1) return res.status(404).json({ error: "Appointment not found" });
      mockStore.appointments[index] = {
        ...mockStore.appointments[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      writeMockLog(
        "system@evercare.com",
        "Appointment Modified",
        `Apt ${id} updated to: ${updates.status || mockStore.appointments[index].status}`
      );
      return res.json(mockStore.appointments[index]);
    }

    await db.collection("appointments").doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return res.json({ id, ...updates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
