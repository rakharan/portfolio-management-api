import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTable1754041756264 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE orders (
                id INT PRIMARY KEY AUTO_INCREMENT,
                portfolio_id INT NOT NULL,
                asset_id INT NOT NULL,
                client_id INT NOT NULL,
                group_id INT NULL,
                side ENUM('BUY', 'SELL') NOT NULL,
                order_type ENUM('MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT') NOT NULL,
                quantity DECIMAL(20, 8) NOT NULL,
                price DECIMAL(20, 8) NULL, -- Order price (limit/stop price)
                stop_loss DECIMAL(20, 8) NULL, -- Stop loss price
                take_profit DECIMAL(20, 8) NULL, -- Take profit price
                status ENUM('PENDING', 'OPEN', 'PARTIAL_FILLED', 'FILLED', 'CANCELLED', 'REJECTED', 'EXPIRED') NOT NULL,
                order_value DECIMAL(20, 8) NULL, -- Total order value (price * quantity)
                broker_order_id VARCHAR(255) NULL, -- The ID from a real brokerage partner
                filled_quantity DECIMAL(20, 8) DEFAULT 0,
                average_fill_price DECIMAL(20, 8) NULL,
                close_price DECIMAL(20, 8) NULL, -- Price when order was closed/filled
                fees DECIMAL(20, 8) DEFAULT 0, -- Trading fees
                notes TEXT NULL, -- Additional notes or comments
                expires_at TIMESTAMP NULL, -- Order expiration time
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                closed_at TIMESTAMP NULL, -- When order was closed/filled
                FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
                FOREIGN KEY (asset_id) REFERENCES assets(id),
                FOREIGN KEY (client_id) REFERENCES clients(id),
                FOREIGN KEY (group_id) REFERENCES user_groups(id),
                INDEX idx_portfolio_status (portfolio_id, status),
                INDEX idx_asset_side (asset_id, side),
                INDEX idx_client_created (client_id, created_at),
                INDEX idx_status_type (status, order_type)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS orders`);
    }

}