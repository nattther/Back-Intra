import express from "express";
import { addUserToClass, getClassesOfUser, getUsersOfClass, removeUserFromClass } from "../controllers/userClassesController";

const router = express.Router();

// Ajouter un user à une classe
router.post("/", addUserToClass);

// Récupérer les classes d’un user
router.get("/user/:userId", getClassesOfUser);

// Récupérer les users d’une classe
router.get("/class/:classId", getUsersOfClass);

// Retirer un user d’une classe
router.delete("/", removeUserFromClass);

export default router;
