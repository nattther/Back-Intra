import { Request, Response } from "express";
import { db } from "../db";


export const getTeachers = async (req: Request, res: Response) => {
    const result = await db.query("SELECT * FROM teachers");
    res.json(result.rows);
};

export const createTeacher = async (req: Request, res: Response) => {
    const { userId, speciality } = req.body;
    await db.query(
        "INSERT INTO teachers (user_id, speciality) VALUES ($1,$2)",
        [userId, speciality]
    );
    res.json({ message: "Teacher created" });
};
