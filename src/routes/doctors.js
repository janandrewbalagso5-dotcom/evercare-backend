import { Router } from "express";
import { supabase } from "../supabase/client.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("doctors").select("*");
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;
  if (!availability) return res.status(400).json({ error: "availability field is required" });
  try {
    const { data, error } = await supabase
      .from("doctors").update({ availability }).eq("id", id).select().single();
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("doctors").insert(req.body).select().single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from("doctors").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;