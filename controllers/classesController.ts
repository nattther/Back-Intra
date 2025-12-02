import { Request, Response } from "express";
import { db } from "../db";


export const getClasses = async (req: Request, res: Response) => {
    const result = await db.query("SELECT * FROM classes");
    res.json(result.rows);
};

export const createClass = async (req: Request, res: Response) => {
    const { label } = req.body;
    await db.query("INSERT INTO classes (label) VALUES ($1)", [label]);
    res.json({ message: "Class created" });
};
