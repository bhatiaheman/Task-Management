import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";
import { env } from "../config/env.js";
import { RefreshToken } from "../entities/refresh-token.entity.js";
import { Task } from "../entities/task.entity.js";
import { User } from "../entities/user.entity.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * All files in `src/migrations` (or `dist/migrations` after build) are picked up automatically.
 * After `migration:generate`, save the new file under `src/migrations/` — no edits here.
 */
const migrationsGlob = join(__dirname, "..", "migrations", "*.{ts,js}");

/** CLI (`migration:*`) requires this file to default-export exactly one `DataSource`. */
export default new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  entities: [User, RefreshToken, Task],
  migrations: [migrationsGlob],
  synchronize: false,
  logging: env.DB_LOGGING,
});
