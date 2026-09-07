import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHeroBannersTable1788756113146 implements MigrationInterface {
    name = 'CreateHeroBannersTable1788756113146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."hero_banners_data_alignment_enum" AS ENUM('left', 'center', 'right')`);
        await queryRunner.query(`CREATE TABLE "hero_banners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "image_url" character varying NOT NULL, "image_public_id" character varying NOT NULL, "data_alignment" "public"."hero_banners_data_alignment_enum" NOT NULL DEFAULT 'left', "show_data" boolean NOT NULL DEFAULT false, "position" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_4bdf7773d7ed79096c404e2f821" UNIQUE ("title"), CONSTRAINT "PK_e9db7f8dc0ad81aac021cfc0c42" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "hero_banners"`);
        await queryRunner.query(`DROP TYPE "public"."hero_banners_data_alignment_enum"`);
    }

}
