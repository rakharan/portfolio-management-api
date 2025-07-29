import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserGroupRulesTable1753764969951 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user_group_rules (
                group_id INT NOT NULL,
                rule_id INT NOT NULL,
                PRIMARY KEY (group_id, rule_id),
                FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
                FOREIGN KEY (rule_id) REFERENCES user_rules(id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user_group_rules`);
    }

}
