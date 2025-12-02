import { Pool } from "pg";

export const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "techcampus",
    password: "root",
    port: 5432
});
