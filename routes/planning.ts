import express from "express";
import { getPlanning, addCourse } from "../controllers/planningController";

const router = express.Router();

router.get("/", getPlanning);
router.post("/", addCourse);

export default router;
