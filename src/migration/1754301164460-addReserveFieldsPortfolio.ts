import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReserveFieldsPortfolio1754301164460 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE portfolios 
            ADD COLUMN available_balance DECIMAL(20, 8) DEFAULT 0 COMMENT 'Available cash for new orders' AFTER cash_balance,
            ADD COLUMN reserved_balance DECIMAL(20, 8) DEFAULT 0 COMMENT 'Cash reserved for pending orders' AFTER available_balance
        `);

        // Add constraint to ensure reserved doesn't exceed cash
        await queryRunner.query(`
            ALTER TABLE portfolios 
            ADD CONSTRAINT chk_portfolio_balance_integrity 
            CHECK (reserved_balance <= cash_balance AND available_balance <= cash_balance)
        `);

        // Add constraint to ensure balances are non-negative
        await queryRunner.query(`
            ALTER TABLE portfolios 
            ADD CONSTRAINT chk_portfolio_balance_positive 
            CHECK (cash_balance >= 0 AND available_balance >= 0 AND reserved_balance >= 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE portfolios DROP CONSTRAINT chk_portfolio_balance_integrity`);
        await queryRunner.query(`ALTER TABLE portfolios DROP CONSTRAINT chk_portfolio_balance_positive`);
        await queryRunner.query(`
            ALTER TABLE portfolios 
            DROP COLUMN available_balance,
            DROP COLUMN reserved_balance
        `);
    }

}
