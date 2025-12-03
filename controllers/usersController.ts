import { Request, Response } from "express";
import { db } from "../db";


export const getUsers = async (req: Request, res: Response) => {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
};

export const checkRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;

  // récupère l'utilisateur
  const result = await db.query("SELECT role FROM users WHERE id = $1", [userId]);
  if (result.rows.length === 0) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const actualRole = result.rows[0].role;
  const ok = actualRole === role;
  res.json({ ok });
};

// dans usersController.ts
export const createUser = async (req, res) => {
  const { name, email, role, classId, speciality } = req.body;
  const result = await db.query(
    "INSERT INTO users (name, email, role) VALUES ($1,$2,$3) RETURNING id",
    [name, email, role]
  );
  const userId = result.rows[0].id;

  if (role === "student") {
    await db.query(
      "INSERT INTO students (user_id, class_id) VALUES ($1,$2)",
      [userId, classId]
    );
  } else if (role === "teacher") {
    await db.query(
      "INSERT INTO teachers (user_id, speciality) VALUES ($1,$2)",
      [userId, speciality]
    );
  }

  res.json({ message: "User and profile created" });
};

