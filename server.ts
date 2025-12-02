import express from "express";
import { json } from "express";
import multer from "multer";

import usersRoutes from "./routes/users";
import classesRoutes from "./routes/classes";
import studentsRoutes from "./routes/students";
import teachersRoutes from "./routes/teachers";
import notesRoutes from "./routes/notes";
import documentsRoutes from "./routes/documents";
import planningRoutes from "./routes/planning";

const app = express();
app.use(json());

app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/users", usersRoutes);
app.use("/classes", classesRoutes);
app.use("/students", studentsRoutes);
app.use("/teachers", teachersRoutes);
app.use("/notes", notesRoutes);
app.use("/documents", documentsRoutes);
app.use("/planning", planningRoutes);


app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});
