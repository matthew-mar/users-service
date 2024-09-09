import { Module } from "@nestjs/common";
import { DbSeederService } from "./db-seeder.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [DbSeederService],
})
export class CommandsModule {}

