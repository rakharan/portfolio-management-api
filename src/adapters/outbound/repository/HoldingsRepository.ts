import { QueryRunner } from "typeorm";

export default class HoldingsRepository {
    static async DBUpdateHoldingOnSell(portfolio_id: number, asset_id: number, filled_quantity: number, query_runner: QueryRunner) {
        if (query_runner && !query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        const updateHolding = await query_runner.query(
            `UPDATE holdings SET quantity = quantity - ? WHERE portfolio_id = ? AND asset_id = ?`,
            [filled_quantity, portfolio_id, asset_id]
        );

        if (updateHolding.affectedRows < 1) {
            throw new Error("FAILED_TO_UPDATE_HOLDING_ON_SELL");
        }

        return updateHolding;
    }

    static async DBUpdateHoldingOnBuy(portfolio_id: number, asset_id: number, filled_quantity: number, average_cost: number, query_runner: QueryRunner) {
        if (query_runner && !query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        const updateHolding = await query_runner.query(
            `UPDATE holdings SET quantity = quantity + ?, average_cost = ?, updated_at = NOW() WHERE portfolio_id = ? AND asset_id = ?`,
            [filled_quantity, average_cost, portfolio_id, asset_id]
        );

        if (updateHolding.affectedRows < 1) {
            throw new Error("FAILED_TO_UPDATE_HOLDING_ON_BUY");
        }

        return updateHolding;
    }
}