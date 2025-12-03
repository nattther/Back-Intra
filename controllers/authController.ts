import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  role: string;
}

const JWT_SECRET =  "dev-secret"; 
const JWT_EXPIRES_IN = "2h";

/**
 * POST /auth/login
 * Body: { email, password }
 * Retourne: { token, role, user }
 */export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("LOGIN TRY:", { email, password }); // debug

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const result = await db.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("LOGIN: user not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    console.log("LOGIN: user found:", user.email, user.role);

    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log("LOGIN: password valid ?", isValid);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role } as JwtPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ error: "DB error" });
  }
};



/**
 * GET /auth/me
 * Récupère l'utilisateur à partir du token (middleware auth obligatoire)
 */
export const getMe = async (req: Request, res: Response) => {
  // on a rajouté req.user dans le middleware
  const authUser = (req as any).user as JwtPayload | undefined;

  if (!authUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [authUser.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ error: "DB error" });
  }
};
