import { Router } from "express";
import { supabase } from "../supabase/client.js";

const router = Router();

const toSnakeCase = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`),
      v ?? null,
    ])
  );

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("appointments").select("*").order("date", { ascending: true });
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const newApt = toSnakeCase({
    id: "apt_" + Date.now(),
    status: "Pending",
    paymentStatus: "Unpaid",
    prescription: "",
    notes: "",
    updatedAt: new Date().toISOString(),
    ...req.body,
  });
  try {
    const { data, error } = await supabase.from("appointments").insert(newApt).select().single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = toSnakeCase({ ...req.body, updatedAt: new Date().toISOString() });
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", id).select().single();
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;