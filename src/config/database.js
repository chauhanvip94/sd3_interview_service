import { DataSource } from "typeorm";
import { User, LoadTest, LoadTestMetrics } from "../entities/index.js";

const database = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "sd3_interview",
  synchronize: true,
  logging: false,
  entities: [User, LoadTest, LoadTestMetrics],
});

export default database;
