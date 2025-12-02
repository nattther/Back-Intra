import { Request, Response } from "express";
import { db } from "../db";


export const getStudents = async (req: Request, res: Response) => {
    const result = await db.query("SELECT * FROM students");
    res.json(result.rows);
};

export const createStudent = async (req: Request, res: Response) => {
    const { userId, classId } = req.body;
    await db.query(
        "INSERT INTO students (user_id, class_id) VALUES ($1,$2)",
        [userId, classId]
    );
    res.json({ message: "Student created" });
};
