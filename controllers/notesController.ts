// controllers/notesController.ts
import { Request, Response } from "express";
import { db } from "../db";

export const getNotes = async (req: Request, res: Response) => {
  const result = await db.query("SELECT * FROM notes");
  res.json(result.rows);
};

export const addNote = async (req: Request, res: Response) => {
  // ⬇️ on lit les mêmes noms que ceux envoyés et que ceux de l'OpenAPI
  const {
    student_user_id,
    teacher_user_id,
    class_id,
    value,
    ects,
  } = req.body;

  if (
    student_user_id == null ||
    teacher_user_id == null ||
    class_id == null ||
    value == null ||
    ects == null
  ) {
    return res.status(400).json({
      error: "Missing required fields",
      details: {
        student_user_id,
        teacher_user_id,
        class_id,
        value,
        ects,
      },
    });
  }

  try {
    await db.query(
      `INSERT INTO notes (student_user_id, teacher_user_id, class_id, value, ects)
       VALUES ($1,$2,$3,$4,$5)`,
      [student_user_id, teacher_user_id, class_id, value, ects]
    );
    return res.status(201).json({ message: "Note added" });
  } catch (err) {
    console.error("addNote error:", err);
    return res
      .status(500)
      .json({ error: "Database error", details: (err as Error).message });
  }
};
