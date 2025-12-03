// controllers/documentsController.ts
import { Request, Response } from "express";
import { db } from "../db";

export const uploadDocument = async (req: Request, res: Response) => {
  const authUser = (req as any).user as { userId: number; role: string } | undefined;
  const { type } = req.body;
  const filePath = req.file?.path;

  if (!authUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!filePath || !type) {
    return res.status(400).json({ error: "Missing file or type" });
  }

  try {
    await db.query(
      `
      INSERT INTO documents (user_id, type, file_path, status)
      VALUES ($1, $2, $3, 'pending')
      `,
      [authUser.userId, type, filePath]
    );

    return res.json({ message: "File uploaded, waiting for validation" });
  } catch (err) {
    console.error("uploadDocument error:", err);
    return res.status(500).json({ error: "DB error" });
  }

  
};

export const validateDocument = async (req: Request, res: Response) => {
  const authUser = (req as any).user as { userId: number; role: string } | undefined;
  const { id } = req.params;

  if (!authUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await db.query(
      `
      UPDATE documents
      SET status = 'validated',
          validated_by_user_id = $1,
          validated_at = NOW()
      WHERE id = $2
      RETURNING id, user_id, type, file_path, status, validated_by_user_id, validated_at
      `,
      [authUser.userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.json({ message: "Document validated", document: result.rows[0] });
  } catch (err) {
    console.error("validateDocument error:", err);
    return res.status(500).json({ error: "DB error" });
  }
};


export const getPendingDocuments = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `
      SELECT d.*, u.name AS owner_name, u.email AS owner_email
      FROM documents d
      JOIN users u ON u.id = d.user_id
      WHERE d.status = 'pending'
      ORDER BY d.id DESC
      `
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("getPendingDocuments error:", err);
    return res.status(500).json({ error: "DB error" });
  }
};
