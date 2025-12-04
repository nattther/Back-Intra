import express from "express";
import { json } from "express";
import multer from "multer";

import usersRoutes from "./routes/users";
import classesRoutes from "./routes/classes";
import notesRoutes from "./routes/notes";
import documentsRoutes from "./routes/documents";
import planningRoutes from "./routes/planning";
import userClassesRoutes from "./routes/userClasses";
import authRoutes from "./routes/authRoutes";

import cvecRoutes from "./routes/cvecRoutes";




import { db } from "./db"; // <-- IMPORTANT : APRES les imports

const app = express();
app.use(json());

app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/users", usersRoutes);
app.use("/classes", classesRoutes);
app.use("/notes", notesRoutes);
app.use("/documents", documentsRoutes);
app.use("/planning", planningRoutes);
app.use("/user-classes", userClassesRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/payments", cvecRoutes);

// TEST CONNEXION BDD
db.query("SELECT NOW()").then(res => {
    console.log("Connexion PostgreSQL OK :", res.rows[0]);
});

app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});
