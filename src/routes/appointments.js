import { Router } from "express";
import { supabase } from "../supabase/client.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("appointments").select("*").order("date", { ascending: true });
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const appointmentData = req.body;
  const newApt = {
    id: "apt_" + Date.now(),
    status: "Pending",
    payment_status: "Unpaid",
    prescription: "",
    notes: "",
    updated_at: new Date().toISOString(),
    ...appointmentData,
  };
  try {
    const { data, error } = await supabase.from("appointments").insert(newApt).select().single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;