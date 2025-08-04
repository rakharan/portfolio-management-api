import HoldingsRepository from '@adapters/outbound/repository/HoldingsRepository';
import OrderRepository from '@adapters/outbound/repository/OrderRepository';
import PortfolioRepository from '@adapters/outbound/repository/PortfolioRepository';
import TransactionRepository from '@adapters/outbound/repository/TransactionRepository';
import { AppDataSource } from '@infrastructure/mysql/connection';
import moment from 'moment';


export default class TransactionService {
    /**
     * Processes a filled order from the broker to create the final transaction records.
     * This acts as our "webhook handler".
     */
    static async processOrderFill(filledOrderData: { orderId: number, filledQuantity: number, averageFillPrice: number, fee: number }) {
        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        try {
            const { orderId, filledQuantity, averageFillPrice, fee } = filledOrderData;

            // 1. Get the original order details
            const order = await OrderRepository.DBGetOrderById(orderId, query_runner);
            if (!order || order.status !== 'SUBMITTED') {
                throw new Error("Order not found or not in a processable state.");
            }

            // 2. Create the permanent transaction record (the ledger entry)
            await TransactionRepository.DBCreateTransaction({
                portfolio_id: order.portfolio_id,
                asset_id: order.asset_id,
                transaction_type: order.side.toLowerCase(), // 'buy' or 'sell'
                quantity: filledQuantity,
                price: averageFillPrice,
                amount: filledQuantity * averageFillPrice,
                fee: fee,
                transaction_date: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            }, query_runner);

            // 3. Finalize the portfolio and holdings update
            if (order.side === 'BUY') {
                const totalDebit = (filledQuantity * averageFillPrice) + fee;
                // Update cash_balance and release the reservation
                await PortfolioRepository.DBUpdateBalanceOnBuy(order.portfolio_id, totalDebit, query_runner);
                // Update the holding record
                await HoldingsRepository.DBUpdateHoldingOnBuy(order.portfolio_id, order.asset_id, filledQuantity, averageFillPrice, query_runner);
            } else { // 'SELL'
                const totalCredit = (filledQuantity * averageFillPrice) - fee;
                // Update cash_balance and get realized P/L
                await PortfolioRepository.DBUpdateBalanceOnSell(order.portfolio_id, totalCredit, query_runner);
                // Update the holding record and release reserved assets
                await HoldingsRepository.DBUpdateHoldingOnSell(order.portfolio_id, order.asset_id, filledQuantity, query_runner);
            }

            // 4. Update the order status to 'FILLED'
            await OrderRepository.DBUpdateOrderStatus(orderId, 'FILLED', query_runner);

            await query_runner.commitTransaction();
            console.log(`Successfully processed fill for order ${orderId}`);

        } catch (error) {
            await query_runner.rollbackTransaction();
            console.error(`Failed to process fill for order ${filledOrderData.orderId}`, error);
            // Here you would update the order status to 'REJECTED' or 'FAILED'
        } finally {
            await query_runner.release();
        }
    }
}