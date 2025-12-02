import { Request, Response } from "express";
import { db } from "../db";


export const getNotes = async (req: Request, res: Response) => {
    const result = await db.query("SELECT * FROM notes");
    res.json(result.rows);
};

export const addNote = async (req: Request, res: Response) => {
    const { studentId, teacherId, value, ects } = req.body;
    await db.query(
        "INSERT INTO notes (student_id, teacher_id, value, ects) VALUES ($1,$2,$3,$4)",
        [studentId, teacherId, value, ects]
    );
    res.json({ message: "Note added" });
};
