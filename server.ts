import express from "express";
import { json } from "express";
import multer from "multer";
import swaggerUi from "swagger-ui-express";
import YAML from 'yamljs';           // ou 'yaml'
import path from 'path';

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
const swaggerDocument = YAML.load(path.resolve(__dirname, './openapi.yaml'));
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// démarrage du serveur
app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
  console.log("Swagger UI: http://localhost:3000/api-docs");
});