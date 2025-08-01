import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUserRulesTable1753771154447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO user_rules (id, permission_name) VALUES
                -- 100-199: Portfolio Management
                (101, 'portfolio:create'),
                (102, 'portfolio:view:own'),
                (103, 'portfolio:view:assigned'),
                (104, 'portfolio:view:all'),
                (105, 'portfolio:update:own'),
                (106, 'portfolio:update:assigned'),
                (107, 'portfolio:delete:assigned'),

                -- 200-299: Transaction Management
                (201, 'transaction:create:assigned'),
                (202, 'transaction:view:own'),
                (203, 'transaction:view:assigned'),
                (204, 'transaction:view:all'),

                -- 900-999: System Administration
                (901, 'admin:manage_users'),
                (902, 'admin:manage_roles');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // You can use a more generic delete or specify the IDs
        await queryRunner.query(`DELETE FROM user_rules WHERE id >= 100;`);
    }

}
