import { Router } from "express";
import { supabase } from "../supabase/client.js";

const router = Router();

router.get("/logs", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("logs").select("*").order("timestamp", { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/logs", async (req, res) => {
  const { email, action, details } = req.body;
  if (!email || !action) return res.status(400).json({ error: "email and action are required" });
  try {
    const { error } = await supabase.from("logs").insert({
      id: "log_" + Date.now(),
      timestamp: new Date().toISOString(),
      user_email: email, action, details: details || "",
    });
    if (error) throw error;
    return res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/settings", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings").select("*").eq("key", "global").maybeSingle();
    if (error) throw error;
    return res.json(data?.value || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/settings", async (req, res) => {
  try {
    const { error } = await supabase.from("settings")
      .upsert({ key: "global", value: req.body });
    if (error) throw error;
    return res.json(req.body);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/backup", async (req, res) => {
  try {
    const [users, doctors, appointments, transactions, logs] = await Promise.all([
      supabase.from("users").select("*"),
      supabase.from("doctors").select("*"),
      supabase.from("appointments").select("*"),
      supabase.from("transactions").select("*"),
      supabase.from("logs").select("*"),
    ]);
    return res.json({ users: users.data, doctors: doctors.data, appointments: appointments.data, transactions: transactions.data, logs: logs.data, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;