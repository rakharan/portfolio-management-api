import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialAdminUser1753771206102 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO users (group_id, email, password_hash, status) VALUES
            (
                1,
                'admin@wealthtech.com',
                '$2a$12$XBReFOb7eeatiEkRfY7yce.TA46EdB2Xu7XY8FM8J75SQfcJChFdy',
                'active'
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users WHERE email = 'admin@wealthtech.com';`);
    }

}
