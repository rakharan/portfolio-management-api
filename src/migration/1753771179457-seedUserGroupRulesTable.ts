import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUserGroupRulesTable1753771179457 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO user_group_rules (group_id, rule_id) VALUES
                -- Administrator (group_id=1) - Gets all permissions
                (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13),

                -- Advisor (group_id=2) - Manages assigned client portfolios
                (2, 1),  -- Can create portfolios for clients
                (2, 3),  -- Can view their assigned portfolios
                (2, 6),  -- Can update their assigned portfolios
                (2, 7),  -- Can delete their assigned portfolios
                (2, 8),  -- Can execute transactions for assigned portfolios
                (2, 10), -- Can view transactions for assigned portfolios

                -- Client (group_id=3) - Can only view their own data
                (3, 2),  -- Can view their own portfolios
                (3, 9),  -- Can view their own transactions

                -- Compliance Officer (group_id=4) - Read-only access to all financial data
                (4, 4),  -- Can view all portfolios
                (4, 11); -- Can view all transactions
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM user_group_rules;`);
    }

}
