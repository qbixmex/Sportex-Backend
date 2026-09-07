import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomPagesTable1788814150499 implements MigrationInterface {
    name = 'CreateCustomPagesTable1788814150499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."custom_pages_status_enum" AS ENUM('draft', 'hold', 'unpublished', 'published')`);
        await queryRunner.query(`CREATE TABLE "custom_pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "permalink" character varying NOT NULL, "content" text, "position" integer NOT NULL DEFAULT '0', "seo_title" character varying(80), "seo_description" character varying(170), "seo_robots" character varying NOT NULL DEFAULT 'noindex, nofollow', "status" "public"."custom_pages_status_enum" NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_337f05662c3f4494f43c84af782" UNIQUE ("permalink"), CONSTRAINT "PK_9bbf7c05420c7434f117c934345" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "custom_pages"`);
        await queryRunner.query(`DROP TYPE "public"."custom_pages_status_enum"`);
    }

}
