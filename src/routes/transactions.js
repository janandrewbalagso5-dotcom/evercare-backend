import { Router } from "express";
import { db, isMock } from "../firebase/admin.js";
import { mockStore, writeMockLog } from "../firebase/mockData.js";

const router = Router();

// GET /api/transactions  — get all transactions
router.get("/", async (req, res) => {
  try {
    if (isMock) {
      return res.json(mockStore.transactions);
    }

    const snapshot = await db
      .collection("transactions")
      .orderBy("timestamp", "desc")
      .get();

    return res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions  — add transaction
router.post("/", async (req, res) => {
  const txnData = req.body;

  const newTxn = {
    id: txnData.id || "txn_" + Date.now(),
    timestamp: new Date().toISOString(),
    ...txnData,
  };

  try {
    if (isMock) {
      mockStore.transactions.unshift(newTxn);
      writeMockLog(
        txnData.patientName,
        "Payment Recorded",
        `Paid ₱${txnData.amount} via ${txnData.paymentMethod}`
      );
      return res.status(201).json(newTxn);
    }

    await db.collection("transactions").doc(newTxn.id).set(newTxn);
    return res.status(201).json(newTxn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
