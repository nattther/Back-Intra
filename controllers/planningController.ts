// controllers/planningController.ts
import { Request, Response } from "express";
import { db } from "../db";

/**
 * Crée un créneau de cours pour une classe et un prof.
 */
export async function createClassSlot(req: Request, res: Response) {
  const { classId, teacherId, label, room, date, startTime, endTime } = req.body;

  if (!classId || !teacherId || !label || !room || !date || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO planning (class_id, teacher_id, label, room, date, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [classId, teacherId, label, room, date, startTime, endTime]
    );

    return res.status(201).json({ slotId: result.rows[0].id });
  } catch (err) {
    console.error("createClassSlot error:", err);
    return res.status(500).json({ error: "DB error" });
  }
}

/**
 * Planning d'une classe : tous les créneaux + infos prof.
 */
export async function getPlanningForClass(req: Request, res: Response) {
  const { classId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT
        p.id           AS slot_id,
        p.label        AS course_label,
        p.room,
        p.date,
        p.start_time,
        p.end_time,
        t.id           AS teacher_id,
        u.name         AS teacher_name
      FROM planning p
      JOIN teachers t   ON t.id = p.teacher_id
      JOIN users    u   ON u.id = t.user_id
      WHERE p.class_id = $1
      ORDER BY p.date, p.start_time
      `,
      [classId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("getPlanningForClass error:", err);
    return res.status(500).json({ error: "DB error" });
  }
}

/**
 * Planning pour un élève : on passe son user_id,
 * on remonte sa classe, puis les créneaux de cette classe.
 */
export async function getPlanningForStudent(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT
        p.id                 AS slot_id,
        p.label              AS course_label,
        p.room,
        p.date,
        p.start_time,
        p.end_time,
        c.id                 AS class_id,
        c.label              AS class_label,
        t.id                 AS teacher_id,
        u_teacher.name       AS teacher_name
      FROM students s
      JOIN classes  c        ON c.id = s.class_id
      JOIN planning p        ON p.class_id = c.id
      JOIN teachers t        ON t.id = p.teacher_id
      JOIN users u_teacher   ON u_teacher.id = t.user_id
      WHERE s.user_id = $1
      ORDER BY p.date, p.start_time
      `,
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("getPlanningForStudent error:", err);
    return res.status(500).json({ error: "DB error" });
  }
}

/**
 * Planning pour un prof : on passe son user_id,
 * on remonte l'entrée teachers, puis tous les créneaux où il enseigne.
 */
export async function getPlanningForTeacher(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT
        p.id                 AS slot_id,
        p.label              AS course_label,
        p.room,
        p.date,
        p.start_time,
        p.end_time,
        c.id                 AS class_id,
        c.label              AS class_label,
        t.id                 AS teacher_id,
        u_teacher.name       AS teacher_name
      FROM teachers t
      JOIN users    u_teacher ON u_teacher.id = t.user_id
      JOIN planning p         ON p.teacher_id = t.id
      JOIN classes  c         ON c.id = p.class_id
      WHERE u_teacher.id = $1
      ORDER BY p.date, p.start_time
      `,
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("getPlanningForTeacher error:", err);
    return res.status(500).json({ error: "DB error" });
  }
}

/**
 * (Optionnel) Tous les créneaux de toutes les classes.
 */
export async function getAllSlots(req: Request, res: Response) {
  try {
    const result = await db.query(
      `
      SELECT
        p.id                 AS slot_id,
        p.label              AS course_label,
        p.room,
        p.date,
        p.start_time,
        p.end_time,
        c.id                 AS class_id,
        c.label              AS class_label,
        t.id                 AS teacher_id,
        u_teacher.name       AS teacher_name
      FROM planning p
      JOIN classes  c        ON c.id = p.class_id
      JOIN teachers t        ON t.id = p.teacher_id
      JOIN users u_teacher   ON u_teacher.id = t.user_id
      ORDER BY p.date, p.start_time
      `
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("getAllSlots error:", err);
    return res.status(500).json({ error: "DB error" });
  }
}
