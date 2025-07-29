import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEmailToken1753775425758 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            ADD COLUMN email_verification_token VARCHAR(512) NULL AFTER password_hash;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
            DROP COLUMN email_verification_token;
        `);
    }

}
