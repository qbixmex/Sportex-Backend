import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomPageImagesTable1788814150500 implements MigrationInterface {
    name = 'CreateCustomPageImagesTable1788814150500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "custom_page_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image_url" character varying NOT NULL, "image_public_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "parent_page_id" uuid NOT NULL, CONSTRAINT "PK_ea68da79dd5a58a5b1ba485126f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "custom_page_images" ADD CONSTRAINT "FK_6ac9630843ec23b55faf1360b77" FOREIGN KEY ("parent_page_id") REFERENCES "custom_pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_page_images" DROP CONSTRAINT "FK_6ac9630843ec23b55faf1360b77"`);
        await queryRunner.query(`DROP TABLE "custom_page_images"`);
    }

}