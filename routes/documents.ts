// routes/documentsRoutes.ts
import express from "express";
import multer from "multer";
import { uploadDocument, validateDocument, getPendingDocuments } from "../controllers/documentsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = express.Router();

// config basique de Multer (à adapter)
const upload = multer({ dest: "uploads/" });

// Upload d'un document (user connecté)
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);

// Lister les documents en attente (Responsable pédagogique)
router.get(
  "/pending",
  authMiddleware,
  requireRole("responsable_pedagogique"),
  getPendingDocuments
);

// Valider un document (Responsable pédagogique)
router.patch(
  "/:id/validate",
  authMiddleware,
  requireRole("responsable_pedagogique"),
  validateDocument
);

export default router;
