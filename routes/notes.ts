import express from "express";
import { getNotes, addNote } from "../controllers/notesController";

const router = express.Router();

router.get("/", getNotes);
router.post("/", addNote);

export default router;
