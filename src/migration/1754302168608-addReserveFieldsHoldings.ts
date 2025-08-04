import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReserveFieldsHoldings1754302168608 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE holdings 
            ADD COLUMN reserved_quantity DECIMAL(20, 8) DEFAULT 0 COMMENT 'Reserved quantity for pending orders' AFTER quantity,
            ADD COLUMN available_quantity DECIMAL(20, 8) DEFAULT 0 COMMENT 'Available quantity for new orders' AFTER reserved_quantity    
        `)

        // Add constraint to ensure reserved doesn't exceed quantity
        await queryRunner.query(`
            ALTER TABLE holdings
            ADD CONSTRAINT chk_holdings_quantity_integrity
            CHECK (reserved_quantity <= quantity AND available_quantity <= quantity)
        `);

        // Add constraint to ensure quantities are non-negative
        await queryRunner.query(`
            ALTER TABLE holdings
            ADD CONSTRAINT chk_holdings_quantity_positive
            CHECK (quantity >= 0 AND reserved_quantity >= 0 AND available_quantity >= 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE holdings DROP CONSTRAINT chk_holdings_quantity_integrity
        `);
        await queryRunner.query(`
            ALTER TABLE holdings DROP CONSTRAINT chk_holdings_quantity_positive
        `);
        await queryRunner.query(`
            ALTER TABLE holdings
            DROP COLUMN reserved_quantity,
            DROP COLUMN available_quantity
        `);
    }

}
