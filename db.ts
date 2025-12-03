import { Pool } from "pg";

// db.ts
export const db = new Pool({
  connectionString: 'postgresql://localhost:ERR2x82Yoe6zrUC5dtRdB0cmzLJHKeKY@dpg-d4o3gn6r433s73elec5g-a.frankfurt-postgres.render.com/techcampus',
  ssl: {
    rejectUnauthorized: false
  }
});

