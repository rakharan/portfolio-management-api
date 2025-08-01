import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUserGroupRulesTable1753771179457 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO user_group_rules (group_id, rule_id) VALUES
                -- Advisor (group_id=2) - Manages assigned client portfolios
                (2, 101),  -- Can create portfolios for clients
                (2, 103),  -- Can view their assigned portfolios
                (2, 106),  -- Can update their assigned portfolios
                (2, 107),  -- Can delete their assigned portfolios
                (2, 201),  -- Can execute transactions for assigned portfolios
                (2, 203), -- Can view transactions for assigned portfolios

                -- Client (group_id=3) - Can only view their own data
                (3, 102),  -- Can view their own portfolios
                (3, 202),  -- Can view their own transactions

                -- Compliance Officer (group_id=4) - Read-only access to all financial data
                (4, 104),  -- Can view all portfolios
                (4, 204); -- Can view all transactions
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM user_group_rules;`);
    }

}
