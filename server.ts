// server.ts
import express, { json } from "express";
import cors from "cors";
import multer from "multer";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

import usersRoutes from "./routes/users";
import classesRoutes from "./routes/classes";
import notesRoutes from "./routes/notes";
import documentsRoutes from "./routes/documents";
import planningRoutes from "./routes/planning";
import userClassesRoutes from "./routes/userClasses";
import authRoutes from "./routes/authRoutes";
import cvecRoutes from "./routes/cvecRoutes";

import { db } from "./db";

const app = express();

/**
 * 🔐 CORS – très important pour autoriser ton front
 * Ici on autorise ton front en dev (localhost:3001).
 * Tu pourras ajouter ton futur domaine de prod plus tard.
 */
const allowedOrigins = [
  "http://localhost:3001",   
  "http://localhost:3000",  
  "https://back-intra.onrender.com",    // ton front Next en dev
  // "https://ton-front-prod.com", // à ajouter le moment venu
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // passe à true si tu utilises des cookies
  })
);

// Gère aussi les requêtes preflight OPTIONS
app.options("*", cors());

// Middlewares globaux
app.use(json());
app.use("/uploads", express.static("uploads"));

// Swagger
const swaggerDocument = YAML.load(path.resolve(__dirname, "./openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ROUTES
app.use("/users", usersRoutes);
app.use("/classes", classesRoutes);
app.use("/notes", notesRoutes);
app.use("/documents", documentsRoutes);
app.use("/planning", planningRoutes);
app.use("/user-classes", userClassesRoutes);
app.use("/auth", authRoutes);
app.use("/payments", cvecRoutes);

// TEST CONNEXION BDD
db.query("SELECT NOW()")
  .then((res) => {
    console.log("Connexion PostgreSQL OK :", res.rows[0]);
  })
  .catch((err) => {
    console.error("Erreur connexion PostgreSQL :", err);
  });

// 🔁 Render fournit souvent PORT via process.env.PORT
const port =  3000;

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
