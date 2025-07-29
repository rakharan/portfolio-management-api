import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePortfolioTable1753769913568 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE portfolios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                portfolio_type ENUM('retirement', 'taxable', 'education', 'trust') DEFAULT 'taxable',
                target_allocation JSON,
                cash_balance DECIMAL(15, 2) DEFAULT 0.00,
                total_value DECIMAL(15, 2) DEFAULT 0.00,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS portfolios`);
    }

}
