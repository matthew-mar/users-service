import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1725884052942 implements MigrationInterface {
    name = 'CreateUser1725884052942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_service"."user_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TABLE "user_service"."user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "age" integer NOT NULL, "gender" "user_service"."user_gender_enum" NOT NULL, "problems" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_service"."user"`);
        await queryRunner.query(`DROP TYPE "user_service"."user_gender_enum"`);
    }

}
