import { Router } from "express";
import { supabase } from "../supabase/client.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("transactions").select("*").order("timestamp", { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const newTxn = {
    id: req.body.id || "txn_" + Date.now(),
    timestamp: new Date().toISOString(),
    ...req.body,
  };
  try {
    const { data, error } = await supabase.from("transactions").insert(newTxn).select().single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;