import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.getOrThrow("HOST"),
                port: configService.getOrThrow("PORT"),
                database: configService.getOrThrow("DATABASE"),
                username: configService.getOrThrow("USERNAME"),
                password: configService.getOrThrow("PASSWORD"),
                schema: configService.getOrThrow("SCHEMA"),
                autoLoadEntities: true,
            }),
            inject: [ConfigService],
        })
    ]
})
export class DatabaseModule {}
