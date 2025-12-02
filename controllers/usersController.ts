import { Request, Response } from "express";
import { db } from "../db";


export const getUsers = async (req: Request, res: Response) => {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, role } = req.body;
    await db.query(
        "INSERT INTO users (name, email, role) VALUES ($1,$2,$3)",
        [name, email, role]
    );
    res.json({ message: "User created" });
};
