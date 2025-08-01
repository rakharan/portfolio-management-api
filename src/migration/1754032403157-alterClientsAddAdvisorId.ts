import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterClientsAddAdvisorId1754032403157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the new column to the clients table. We allow it to be NULL because
        // a client might be created before an advisor is assigned.
        await queryRunner.query(`
            ALTER TABLE clients
            ADD COLUMN advisor_id INT NULL AFTER user_id,
            ADD CONSTRAINT fk_advisor_id
            FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE SET NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE clients
            DROP FOREIGN KEY fk_advisor_id,
            DROP COLUMN advisor_id;
        `);
    }

}
