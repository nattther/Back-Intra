import express from "express";
import { loginUser, getMe } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// login: email + password -> token + role + user
router.post("/login", loginUser);

// récupère l'utilisateur depuis le token
router.get("/me", authMiddleware, getMe);

export default router;
