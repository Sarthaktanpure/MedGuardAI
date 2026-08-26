import "dotenv/config";

import { createServer } from "./app.js";
import { connectDatabase } from "./db/connect.js";
import { seedDemoData } from "./config/seed.js";

const port = Number(process.env.PORT ?? 5000);

const app = createServer();

const db = await connectDatabase();
if (db.connected) {
  try {
    await seedDemoData();
  } catch (err: any) {
    console.error("❌ Failed to seed database:", err.message);
  }
} else {
  console.warn("⚠️ Database is offline. Skipping demo seeding.");
}

app.listen(port, () => {
  console.log(`MedGuard server listening on ${port}`);
});
