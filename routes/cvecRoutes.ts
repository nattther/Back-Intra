import express from "express";
import { processCvecPayment, getCvecStatusForStudent } from "../controllers/cvecController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Mock paiement CVEC (l'élève se connecte et paye)
router.post("/cvec", authMiddleware, processCvecPayment);

// Statut CVEC pour un étudiant (admin / respo / ou l'étudiant lui-même)
router.get("/cvec/student/:userId", authMiddleware, getCvecStatusForStudent);

export default router;
