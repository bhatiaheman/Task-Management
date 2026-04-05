import "reflect-metadata";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import AppDataSource from "./database/data-source.js";

await AppDataSource.initialize();
await AppDataSource.runMigrations();

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
