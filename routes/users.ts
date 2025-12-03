import express from "express";
import { getUsers, createUser, checkRole } from "../controllers/usersController";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/check-role", checkRole);
export default router;
