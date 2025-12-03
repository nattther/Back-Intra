// routes/planningRoutes.ts
import express from "express";
import {
  createClassSlot,
  getPlanningForClass,
  getPlanningForStudent,
  getPlanningForTeacher,
  getAllSlots,
} from "../controllers/planningController";

const router = express.Router();

// créer un créneau pour une classe
router.post("/", createClassSlot);

// planning d'une classe
router.get("/class/:classId", getPlanningForClass);

// planning pour un élève (via user_id)
router.get("/student/:userId", getPlanningForStudent);

// planning pour un prof (via user_id)
router.get("/teacher/:userId", getPlanningForTeacher);

// tous les créneaux (admin / debug)
router.get("/", getAllSlots);

export default router;
