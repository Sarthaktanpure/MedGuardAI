import "dotenv/config";

import { createServer } from "./app.js";
import { connectDatabase } from "./db/connect.js";
import { seedDemoData } from "./config/seed.js";

const port = Number(process.env.PORT ?? 5000);

const app = createServer();

await connectDatabase();
await seedDemoData();

app.listen(port, () => {
  console.log(`MedGuard server listening on ${port}`);
});
