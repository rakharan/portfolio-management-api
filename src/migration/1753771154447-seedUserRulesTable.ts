import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUserRulesTable1753771154447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO user_rules (id, permission_name) VALUES
                -- Portfolio Permissions
                (1, 'portfolio:create'),
                (2, 'portfolio:view:own'),
                (3, 'portfolio:view:assigned'), -- For advisors to see their clients' portfolios
                (4, 'portfolio:view:all'), -- For admins/compliance
                (5, 'portfolio:update:own'),
                (6, 'portfolio:update:assigned'),
                (7, 'portfolio:delete:assigned'),

                -- Transaction Permissions
                (8, 'transaction:create:assigned'), -- For advisors to execute trades
                (9, 'transaction:view:own'),
                (10, 'transaction:view:assigned'),
                (11, 'transaction:view:all'),

                -- User Management Permissions
                (12, 'admin:manage_users'),
                (13, 'admin:manage_roles');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM user_rules;`);
    }

}
