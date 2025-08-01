import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTable1754041756264 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                portfolio_id INT NOT NULL,
                asset_id INT NOT NULL,
                side ENUM('buy', 'sell') NOT NULL,
                order_type ENUM('market', 'limit') NOT NULL,
                quantity DECIMAL(20, 8) NOT NULL,
                limit_price DECIMAL(20, 8) NULL, -- For limit orders
                status ENUM('submitted', 'working', 'filled', 'cancelled', 'rejected') NOT NULL,
                broker_order_id VARCHAR(255) NULL, -- The ID from a real brokerage partner
                filled_quantity DECIMAL(20, 8) NULL,
                average_fill_price DECIMAL(20, 8) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
                FOREIGN KEY (asset_id) REFERENCES assets(id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS orders`);
    }

}
