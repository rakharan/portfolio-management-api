import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHoldingsAndTransactionsTable1753769947141 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Holdings Table
        await queryRunner.query(`
            CREATE TABLE holdings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                portfolio_id INT NOT NULL,
                asset_id INT NOT NULL,
                quantity DECIMAL(20, 8) NOT NULL,
                average_cost DECIMAL(20, 8) NOT NULL,
                last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
                FOREIGN KEY (asset_id) REFERENCES assets(id),
                UNIQUE KEY unique_portfolio_asset (portfolio_id, asset_id)
            )
        `);

        // Transactions Table
        await queryRunner.query(`
            CREATE TABLE transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                portfolio_id INT NOT NULL,
                asset_id INT, -- Can be NULL for cash deposits/withdrawals
                transaction_type ENUM('buy', 'sell', 'dividend', 'interest', 'fee', 'deposit', 'withdrawal') NOT NULL,
                quantity DECIMAL(20, 8),
                price DECIMAL(20, 8),
                amount DECIMAL(15, 2) NOT NULL,
                fee DECIMAL(15, 2) DEFAULT 0.00,
                transaction_date TIMESTAMP NOT NULL,
                notes TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
                FOREIGN KEY (asset_id) REFERENCES assets(id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS transactions`);
        await queryRunner.query(`DROP TABLE IF EXISTS holdings`);
    }

}
