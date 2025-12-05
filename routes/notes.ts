// routes/notes.ts
import express from "express";
import { getNotes, addNote, getNotesByStudent } from "../controllers/notesController";

const router = express.Router();

// ⚠️ route spécifique AVANT ou APRÈS, peu importe ici,
// "/" ne matche que exactement "/"
router.get("/student/:userId", getNotesByStudent);

router.get("/", getNotes);
router.post("/", addNote);

export default router;
