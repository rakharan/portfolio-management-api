import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialAssets1753771558126 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO assets 
                (symbol, name, asset_type, sector, currency, current_price, price_updated_at) 
            VALUES
                -- US Stocks
                ('AAPL', 'Apple Inc.', 'stock', 'Technology', 'USD', 195.80, NOW()),
                ('MSFT', 'Microsoft Corporation', 'stock', 'Technology', 'USD', 430.50, NOW()),
                ('GOOGL', 'Alphabet Inc. Class A', 'stock', 'Technology', 'USD', 177.20, NOW()),
                
                -- Exchange-Traded Fund (ETF)
                ('SPY', 'SPDR S&P 500 ETF Trust', 'etf', 'Index', 'USD', 545.60, NOW()),
                
                -- Cryptocurrency
                ('BTC', 'Bitcoin', 'crypto', 'Cryptocurrency', 'USD', 64150.75, NOW()),
                
                -- Bond (Example)
                ('US10Y', 'U.S. 10 Year Treasury Note', 'bond', 'Government', 'USD', 98.50, NOW());
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This will remove only the data inserted by this seeder
        await queryRunner.query(`
            DELETE FROM assets WHERE symbol IN ('AAPL', 'MSFT', 'GOOGL', 'SPY', 'BTC', 'US10Y');
        `);
    }

}
