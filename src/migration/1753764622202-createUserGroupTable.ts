import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserGroupTable1753764622202 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user_groups (
                id INT AUTO_INCREMENT PRIMARY KEY,
                group_name VARCHAR(100) UNIQUE NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user_groups`);
    }
}
