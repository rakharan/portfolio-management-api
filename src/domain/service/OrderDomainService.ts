import OrderRepository from "@adapters/outbound/repository/OrderRepository";
import { OrderParamsDto } from "@domain/model/params";

export default class OrderDomainService {
    static async CreateOrderDomain(order: OrderParamsDto.CreateOrderParams, query_runner?: any) {
        if (query_runner && !query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        const createOrder = await OrderRepository.DBCreateOrder(order, query_runner);
        if (createOrder.affectedRows < 1) {
            throw new Error("FAILED_TO_INSERT_ORDER");
        }

        return createOrder.insertId
    }

    static async GetDailyTradingVolume(portfolio_id: number,
        asset_id: number,
        query_runner?: any): Promise<number> {
        if (query_runner && !query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        const dailyVolume = await OrderRepository.DBGetDailyTradingVolume(portfolio_id, asset_id, query_runner);
        if (dailyVolume.length < 1) {
            throw new Error("NO_DAILY_TRADING_VOLUME_FOUND");
        }

        return dailyVolume[0].daily_volume;
    }
}