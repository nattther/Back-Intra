import { Request, Response } from "express";
import { db } from "../db";


export const uploadDocument = async (req: Request, res: Response) => {
    const { userId, type } = req.body;
    const filePath = req.file?.path;

    await db.query(
        "INSERT INTO documents (user_id, type, file_path) VALUES ($1,$2,$3)",
        [userId, type, filePath]
    );

    res.json({ message: "File uploaded" });
};
