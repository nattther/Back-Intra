import { Request, Response } from "express";
import { db } from "../db";

const EXPECTED_CVEC_AMOUNT = 100; // en euros, tu peux aussi mettre ça dans un .env

interface AuthUser {
  userId: number;
  role: string;
}

/**
 * Mock de traitement d'un paiement CVEC.
 *
 * Body attendu:
 * {
 *   "studentUserId": number,
 *   "amount": number,
 *   "paymentToken": "OK_xxxx" | "FAIL_xxx",
 *   "providerReference": "string-optionnel"
 * }
 *
 * Retour:
 * {
 *   "status": "validated" | "rejected",
 *   "reason"?: string
 * }
 */
export const processCvecPayment = async (req: Request, res: Response) => {
  const { studentUserId, amount, paymentToken, providerReference } = req.body;

  if (!studentUserId || !amount || !paymentToken) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // règle métier: la CVEC doit être d'un montant précis
  if (Number(amount) !== EXPECTED_CVEC_AMOUNT) {
    await db.query(
      `
      INSERT INTO cvec_payments (student_user_id, amount, status, provider_reference, raw_payload)
      VALUES ($1, $2, 'rejected', $3, $4)
      `,
      [studentUserId, amount, providerReference || null, JSON.stringify(req.body)]
    );

    return res.status(400).json({
      status: "rejected",
      reason: `Invalid amount, expected ${EXPECTED_CVEC_AMOUNT}`,
    });
  }

  // règle de mock: si le token commence par "OK_", on considère que le paiement est validé
  const isMockValid = typeof paymentToken === "string" && paymentToken.startsWith("OK_");

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const status = isMockValid ? "validated" : "rejected";

    const insertResult = await client.query(
      `
      INSERT INTO cvec_payments (student_user_id, amount, status, provider_reference, raw_payload)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, status
      `,
      [studentUserId, amount, status, providerReference || null, JSON.stringify(req.body)]
    );

    if (isMockValid) {
      await client.query(
        `
        UPDATE users
        SET cvec_paid = true,
            cvec_paid_at = NOW()
        WHERE id = $1
        `,
        [studentUserId]
      );
    }

    await client.query("COMMIT");

    return res.json({
      paymentId: insertResult.rows[0].id,
      status,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("processCvecPayment error:", err);
    return res.status(500).json({ error: "DB error" });
  } finally {
    client.release();
  }
};

/**
 * Récupère le statut CVEC pour un étudiant.
 *
 * GET /payments/cvec/student/:userId
 */
export const getCvecStatusForStudent = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userResult = await db.query(
      "SELECT id, name, email, role, cvec_paid, cvec_paid_at FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const paymentsResult = await db.query(
      `
      SELECT *
      FROM cvec_payments
      WHERE student_user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.json({
      student: userResult.rows[0],
      payments: paymentsResult.rows,
    });
  } catch (err) {
    console.error("getCvecStatusForStudent error:", err);
    return res.status(500).json({ error: "DB error" });
  }
};
