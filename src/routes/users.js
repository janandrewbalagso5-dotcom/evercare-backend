import { Router } from "express";
import { supabase } from "../supabase/client.js";

const router = Router();

router.get("/", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email query param required" });
  try {
    const { data, error } = await supabase
      .from("users").select("*")
      .ilike("email", email).maybeSingle();
    if (error) throw error;
    return res.json(data || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/patients", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users").select("*").eq("role", "patient");
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const userData = req.body;
  if (!userData.email || !userData.name)
    return res.status(400).json({ error: "email and name are required" });
  try {
    const { data: existing } = await supabase
      .from("users").select("uid").ilike("email", userData.email).maybeSingle();
    if (existing) return res.status(409).json({ error: "Email already exists" });

    const newUser = {
      uid: userData.uid || "usr_" + Date.now(),
      two_factor_enabled: false,
      two_factor_secret: Math.floor(100000 + Math.random() * 900000).toString(),
      ...userData,
    };
    const { data, error } = await supabase.from("users").insert(newUser).select().single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const { data, error } = await supabase
      .from("users").update(req.body).eq("uid", uid).select().single();
    if (error) throw error;
    return res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;