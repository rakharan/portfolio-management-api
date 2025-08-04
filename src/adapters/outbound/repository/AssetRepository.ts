import { AppDataSource } from "@infrastructure/mysql/connection";
import moment from "moment";
import { QueryRunner } from "typeorm";

const db = AppDataSource;

export default class AssetRepository {
    static async DBCreateAsset(asset: any, query_runner: QueryRunner): Promise<void> {
        const result = await query_runner.query(
            `
            INSERT INTO assets (symbol, name, asset_type, sector, currency, current_price, price_updated_at, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [asset.symbol, asset.name, asset.asset_type, asset.sector, asset.currency, asset.current_price, asset.price_updated_at, moment.utc().format("YYYY-MM-DD HH:mm:ss"), moment.utc().format("YYYY-MM-DD HH:mm:ss")],
        );

        if (result.affectedRows === 0) {
            throw new Error("FAILED_TO_CREATE_ASSET");
        }
    }

    static async DBGetAssetById(asset_id: number, query_runner?: QueryRunner) {
        const rows = await db.query(
            `SELECT id, symbol, name, asset_type, sector, currency, current_price, price_updated_at, created_at, updated_at FROM assets WHERE id = ?`,
            [asset_id],
            query_runner
        );

        return rows[0]
    }
}