import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAssetsTable1753769894824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE assets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                symbol VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                asset_type ENUM('stock', 'bond', 'etf', 'mutual_fund', 'commodity', 'crypto') NOT NULL,
                sector VARCHAR(100),
                currency VARCHAR(10) DEFAULT 'USD',
                current_price DECIMAL(20, 8),
                price_updated_at TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS assets`);
    }

}
