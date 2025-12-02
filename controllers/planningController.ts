import { Request, Response } from "express";
import { db } from "../db";


export const getPlanning = async (req: Request, res: Response) => {
    const result = await db.query("SELECT * FROM planning");
    res.json(result.rows);
};

export const addCourse = async (req: Request, res: Response) => {
    const { classId, teacherId, label, room, date } = req.body;

    await db.query(
        "INSERT INTO planning (class_id, teacher_id, label, room, date) VALUES ($1,$2,$3,$4,$5)",
        [classId, teacherId, label, room, date]
    );

    res.json({ message: "Course added" });
};
