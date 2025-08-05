import { LogParamsDto, OrderParamsDto } from "@domain/model/params";
import OrderDomainService from "@domain/service/OrderDomainService";
import { AppDataSource } from "@infrastructure/mysql/connection";
import * as OrderSchema from "@helpers/JoiSchema/Order"
import AssetDomainService from "@domain/service/AssetDomainService";
import PortfolioDomainService from "@domain/service/PortfolioDomainService";
import { OrderStatus } from "@domain/model/request/OrderRequest";
import MarketDataService from "@domain/service/MarketDataDomainService";
import FeeConfigDomainService from "@domain/service/FeeConfigDomainService";
import { QueryRunner } from "typeorm";
import MockBrokerService from "@domain/service/MockBrokerService";

export default class OrderAppService {
    /**
     * Handles the creation of a new order.
     * This method performs all necessary pre-trade checks, reserves funds/assets,
     * and submits the order for asynchronous execution.
     */
    static async CreateOrderApp(orderRequest: OrderParamsDto.CreateOrderParams, _logData: LogParamsDto.CreateLogParams) {
        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        const { asset_id, client_id, group_id, order_type, portfolio_id, quantity, side } = orderRequest

        try {
            // STEP 1: VALIDATE INPUT
            // ===============================================
            await OrderSchema.CreateOrder.validateAsync(orderRequest);

            // STEP 2: FETCH & VALIDATE CORE ENTITIES
            // ===============================================
            const asset = await AssetDomainService.GetAssetByIdDomain(asset_id, query_runner);
            if (!asset || !asset.is_active || asset.status !== 'ACTIVE') {
                throw new Error("ASSET_NOT_FOUND_OR_NOT_TRADEABLE");
            }

            const portfolio = await PortfolioDomainService.GetPortfolioDetailsByIdDomain(portfolio_id, query_runner);
            if (!portfolio) {
                throw new Error("PORTFOLIO_NOT_FOUND");
            }

            // STEP 3: AUTHORIZATION CHECK
            // ===============================================
            const isOwner = await PortfolioDomainService.CheckPortfolioOwnershipDomain(
                portfolio_id, client_id, group_id, query_runner
            );
            if (!isOwner) {
                throw new Error("FORBIDDEN_PORTFOLIO_ACCESS");
            }

            // STEP 4: PRE-TRADE CHECKS & VALIDATION
            // ===============================================
            // These checks ensure the order is valid before it's even considered for submission.
            const orderPrice = await this.validateAndGetPrice(orderRequest);
            const orderValue = orderPrice * quantity;

            if (side === 'BUY') {
                await this.validateAndReserveFunds(orderRequest, portfolio, orderValue, query_runner);
            } else { // 'SELL'
                await this.validateAndReserveAssets(orderRequest, query_runner);
            }

            // Since it's late afternoon in Jakarta, US markets are closed. This check is crucial.
            const isTradingHours = await this.checkTradingHours();
            if (!isTradingHours && order_type === 'MARKET') {
                // In a real system, you might queue the order. For now, we reject it.
                throw new Error("MARKET_CLOSED_FOR_MARKET_ORDERS");
            }

            await this.performRiskChecks(orderRequest, portfolio, asset, query_runner);

            // STEP 5: CREATE THE ORDER
            // ===============================================
            // All checks passed. Now we create the order with a 'SUBMITTED' status.
            const orderToCreate = {
                ...orderRequest,
                price: orderPrice,
                status: 'SUBMITTED' as OrderStatus,
            };
            const createdOrder = await OrderDomainService.CreateOrderDomain(orderToCreate, query_runner);

            // STEP 6: COMMIT AND KICK OFF ASYNC PROCESSING
            // ===============================================
            await query_runner.commitTransaction();

            // This happens *after* we commit and respond to the user.
            // It sends the order to the "broker" for execution.
            MockBrokerService.submitOrder({ id: createdOrder, ...orderToCreate });

            // STEP 7: RETURN IMMEDIATE RESPONSE
            // ===============================================
            return {
                message: "Order submitted successfully for execution.",
                order_id: createdOrder,
                status: orderToCreate.status,
            };

        } catch (error) {
            await query_runner.rollbackTransaction();
            throw error;
        } finally {
            await query_runner.release();
        }
    }

    // ===================================================================
    // HELPER METHODS (Your excellent validation logic, encapsulated)
    // ===================================================================

    private static async validateAndGetPrice(order: OrderParamsDto.CreateOrderParams): Promise<number> {
        if (order.order_type === 'MARKET') {
            const marketPrice = await MarketDataService.GetCurrentPrice(order.asset_id);
            if (!marketPrice) throw new Error("MARKET_PRICE_NOT_AVAILABLE");
            return marketPrice;
        }

        if (!order.price || order.price <= 0) throw new Error("INVALID_PRICE_FOR_ORDER_TYPE");
        // ... include your other price validations (precision, min/max) here ...
        return order.price;
    }

    private static async validateAndReserveFunds(order: OrderParamsDto.CreateOrderParams, portfolio: any, orderValue: number, query_runner: QueryRunner): Promise<void> {
        const estimatedFees = await this.calculateOrderFees(orderValue);
        const totalCost = orderValue + estimatedFees;

        if (portfolio.available_balance < totalCost) {
            throw new Error("INSUFFICIENT_FUNDS");
        }
        await PortfolioDomainService.ReserveFundsDomain(order.portfolio_id, totalCost, query_runner);
    }

    private static async validateAndReserveAssets(order: OrderParamsDto.CreateOrderParams, query_runner: QueryRunner): Promise<void> {
        const holding = await PortfolioDomainService.GetAssetHoldingsByPortfolioIdDomain(order.portfolio_id, order.asset_id, query_runner);
        if (!holding || holding.available_quantity < order.quantity) {
            throw new Error("INSUFFICIENT_ASSET_HOLDINGS");
        }
        await PortfolioDomainService.ReserveAssetsDomain(order.portfolio_id, order.asset_id, order.quantity, query_runner);
    }

    private static async calculateOrderFees(orderValue: number): Promise<number> {
        const feeConfig = await FeeConfigDomainService.GetFeeConfig();
        let fees = 0;
        if (feeConfig?.percentage_fee) fees += orderValue * (feeConfig.percentage_fee / 100);
        if (feeConfig?.fixed_fee) fees += feeConfig.fixed_fee;
        return Math.round(fees * 100) / 100;
    }

    // Helper method to check trading hours
    private static async checkTradingHours(): Promise<boolean> {
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

        // Get market hours for the asset
        const marketHours = await MarketDataService.GetMarketHours();

        if (!marketHours) {
            return true; // Assume 24/7 if no specific hours defined
        }

        // Check if current day is a trading day
        if (marketHours.closed_days && marketHours.closed_days.includes(currentDay)) {
            return false;
        }

        // Check if within trading hours
        const openTime = marketHours.open_time; // e.g., 930 for 9:30 AM
        const closeTime = marketHours.close_time; // e.g., 1600 for 4:00 PM

        return currentTime >= openTime && currentTime <= closeTime;
    }

    // Helper method for risk management checks
    private static async performRiskChecks(
        order: OrderParamsDto.CreateOrderParams,
        portfolio: any,
        asset: any,
        query_runner: any
    ): Promise<void> {
        // Check daily trading limits
        const dailyVolume = await OrderDomainService.GetDailyTradingVolume(
            order.portfolio_id,
            order.asset_id,
            query_runner
        );

        if (portfolio.daily_trading_limit && dailyVolume > portfolio.daily_trading_limit) {
            throw new Error("DAILY_TRADING_LIMIT_EXCEEDED");
        }

        // Check position concentration limits
        if (order.side === 'BUY') {
            const currentHolding = await PortfolioDomainService.GetAssetHoldingsByPortfolioIdDomain(
                order.portfolio_id,
                order.asset_id,
                query_runner
            );

            const { total_value } = await PortfolioDomainService.GetPortfolioDetailsByIdDomain(
                order.portfolio_id,
                query_runner
            );

            const newHoldingValue = (currentHolding?.value || 0) + (order.quantity * order.price);
            const concentrationPercentage = (newHoldingValue / total_value) * 100;

            if (asset.max_concentration_percentage &&
                concentrationPercentage > asset.max_concentration_percentage) {
                throw new Error("POSITION_CONCENTRATION_LIMIT_EXCEEDED");
            }
        }

        // Check order size relative to average daily volume
        const avgDailyVolume = await MarketDataService.GetAverageDailyVolume(
            order.asset_id
        );

        if (avgDailyVolume && order.quantity > (avgDailyVolume * 0.1)) {
            // Order is more than 10% of average daily volume
            throw new Error("ORDER_SIZE_TOO_LARGE");
        }
    }
}