// controllers/usersController.ts
import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";

export const getUsers = async (req: Request, res: Response) => {
  // on évite de renvoyer le password_hash
  const result = await db.query("SELECT id, name, email, role FROM users");
  res.json(result.rows);
};

export const checkRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;
  const result = await db.query("SELECT role FROM users WHERE id = $1", [userId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const actualRole = result.rows[0].role;
  res.json({ ok: actualRole === role });
};

/**
 * Crée un user + l'associe à une classe si besoin.
 * Body attendu : { name, email, role, password, classId? }
 */
export const createUser = async (req: Request, res: Response) => {
  const { name, email, role, classId, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (name, email, role, password_hash) VALUES ($1,$2,$3,$4) RETURNING id",
      [name, email, role, passwordHash]
    );
    const userId = result.rows[0].id;

    if (classId) {
      await db.query(
        "INSERT INTO user_classes (user_id, class_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
        [userId, classId]
      );
    }

    res.status(201).json({ message: "User created", userId });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ error: "DB error" });
  }
};
