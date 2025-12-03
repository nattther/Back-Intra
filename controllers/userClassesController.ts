import { Request, Response } from "express";
import { db } from "../db";

export const addUserToClass = async (req: Request, res: Response) => {
  const { userId, classId } = req.body;
  await db.query(
    "INSERT INTO user_classes (user_id, class_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [userId, classId]
  );
  res.json({ message: "User added to class" });
};

export const getClassesOfUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await db.query(
    `SELECT c.* 
     FROM classes c
     JOIN user_classes uc ON uc.class_id = c.id
     WHERE uc.user_id = $1`,
    [userId]
  );
  res.json(result.rows);
};

export const getUsersOfClass = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const result = await db.query(
    `SELECT u.* 
     FROM users u
     JOIN user_classes uc ON uc.user_id = u.id
     WHERE uc.class_id = $1`,
    [classId]
  );
  res.json(result.rows);
};

export const removeUserFromClass = async (req: Request, res: Response) => {
  const { userId, classId } = req.body;
  await db.query(
    "DELETE FROM user_classes WHERE user_id = $1 AND class_id = $2",
    [userId, classId]
  );
  res.json({ message: "User removed from class" });
};
