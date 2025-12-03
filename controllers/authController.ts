// controllers/authController.ts
import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const result = await db.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Pour l’instant, on renvoie juste les infos du user (sans le hash).
    // Plus tard tu pourras ajouter un JWT ici.
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ error: "DB error" });
  }
};
