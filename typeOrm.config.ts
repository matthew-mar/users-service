import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { User } from "./src/users/entities/user.entity";
import { DataSource } from "typeorm";

config();

const configService = new ConfigService();

export default new DataSource({
    type: "postgres",
    host: configService.getOrThrow("HOST"),
    port: configService.getOrThrow("PORT"),
    database: configService.getOrThrow("DATABASE"),
    username: configService.getOrThrow("USERNAME"),
    password: configService.getOrThrow("PASSWORD"),
    schema: configService.getOrThrow("SCHEMA"),
    migrations: ["migrations/**"],
    entities: [User]
});
