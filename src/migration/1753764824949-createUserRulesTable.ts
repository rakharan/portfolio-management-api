import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserRulesTable1753764824949 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user_rules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                permission_name VARCHAR(100) UNIQUE NOT NULL COMMENT 'e.g., create_portfolio, view_all_clients'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user_rules`);
    }

}
