import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAnnouncementsTableColumns1788829175748 implements MigrationInterface {
    name = 'AlterAnnouncementsTableColumns1788829175748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "publishedAt"`);
        await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "imagePublicId"`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD "published_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD "image_url" character varying`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD "image_public_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "image_public_id"`);
        await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "published_at"`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD "imagePublicId" character varying`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD "publishedAt" TIMESTAMP WITH TIME ZONE`);
    }

}
