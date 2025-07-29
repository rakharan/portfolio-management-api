import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialAdminUser1753771206102 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO users (group_id, email, password_hash, status) VALUES
            (
                1,
                'admin@wealthtech.com',
                '$2a$12$CLjqBvMF18bM0wuZhVNpLOvxtFjb3iaf7/iHtT0c7amDfbfUuBIiy',
                'active'
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users WHERE email = 'admin@wealthtech.com';`);
    }

}
