import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1788826577614 implements MigrationInterface {
    name = 'Migrations1788826577614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "imagePublicId"`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "image_url" character varying`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "image_public_id" character varying`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "start_date" date`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "end_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "image_public_id"`);
        await queryRunner.query(`ALTER TABLE "sponsors" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "imagePublicId" character varying`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "endDate" date`);
        await queryRunner.query(`ALTER TABLE "sponsors" ADD "startDate" date`);
    }

}
