import { Request, Response } from "express";
import { db } from "../db";

export const getNotes = async (req: Request, res: Response) => {
  const result = await db.query("SELECT * FROM notes");
  res.json(result.rows);
};

export const addNote = async (req: Request, res: Response) => {
  const { studentUserId, teacherUserId, classId, value, ects } = req.body;
  try {
    await db.query(
      `INSERT INTO notes (student_user_id, teacher_user_id, class_id, value, ects)
       VALUES ($1,$2,$3,$4,$5)`,
      [studentUserId, teacherUserId, classId, value, ects]
    );
    res.json({ message: "Note added" });
  } catch (err) {
    console.error("addNote error:", err);
    res.status(500).json({ error: "Database error", details: err });
  }
};
