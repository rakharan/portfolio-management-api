import AssetRepository from "@adapters/outbound/repository/AssetRepository";
import OrderRepository from "@adapters/outbound/repository/OrderRepository";
import TransactionService from "./TransacitonDomainService";

interface SubmittedOrder {
    id: number;
    asset_id: number;
    quantity: number;
    // ... other order properties
}

export default class MockBrokerService {
    /**
     * Simulates submitting an order to an external broker.
     * After a delay, it mimics a "fill" notification by calling the TransactionService.
     * @param order The order object created by OrderAppService.
     */
    static submitOrder(order: SubmittedOrder) {
        // Log the initial reception of the order
        console.log(`[Mock Broker]: Order ${order.id} for ${order.quantity} units of asset ${order.asset_id} received. Sending to market...`);

        // This is where a real application would make an API call to a broker like Alpaca or Interactive Brokers.
        // We will simulate this with a delay.
        const executionDelay = 5000; // 5 seconds

        setTimeout(async () => {
            // This code block runs *after* the delay, simulating a webhook callback from the broker.
            try {
                // 1. Simulate a realistic fill price.
                // We'll get the asset's last known price and add a small, random variation.
                const asset = await AssetRepository.DBGetAssetById(order.asset_id);
                if (!asset) throw new Error(`Asset ID ${order.asset_id} not found for fill.`);

                const priceVariation = (Math.random() - 0.5) * 0.01; // +/- 0.5% variation
                const averageFillPrice = parseFloat((asset.current_price * (1 + priceVariation)).toFixed(4));

                console.log(`[Mock Broker]: Order ${order.id} has been FILLED at an average price of ${averageFillPrice}. Sending notification back to our system.`);

                // 2. Prepare the "filled order" payload, just like a real broker's webhook would.
                const filledOrderData = {
                    orderId: order.id,
                    filledQuantity: order.quantity, // For simplicity, we assume full execution.
                    averageFillPrice: averageFillPrice,
                    fee: 12.50 // A sample flat fee for the transaction.
                };

                // 3. Trigger the final post-trade processing.
                // This is the most important step: it tells our system the trade is done.
                await TransactionService.processOrderFill(filledOrderData);

            } catch (error) {
                console.error(`[Mock Broker]: ERROR processing fill for order ${order.id}:`, error);

                // If something went wrong, update the order status to 'REJECTED'.
                await OrderRepository.DBUpdateOrderStatus(order.id, 'REJECTED');
            }
        }, executionDelay);
    }
}