// scripts/initDb.ts
import fs from "fs";
import path from "path";
import { db } from "./db";


async function initDb() {
  try {
    const filePath = path.join( "./", "mcd", "bdd.sql");
    const sql = fs.readFileSync(filePath, "utf-8");

    // On sépare les commandes SQL par “;” (afin d’exécuter chaque requête individuellement)
    const statements = sql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      await db.query(stmt);
    }

    console.log("✅ Database initialized (tables created).");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error initializing database:", err);
    process.exit(1);
  }
}

initDb();
