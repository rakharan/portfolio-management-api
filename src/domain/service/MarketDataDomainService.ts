export default class MarketDataService {
    // Get current market price for an asset
    static async GetCurrentPrice(assetId: number): Promise<number | null> {
        // Mock price based on asset ID for testing
        const mockPrices: { [key: string]: number } = {
            'AAPL': 150.25,
            'GOOGL': 2500.80,
            'MSFT': 300.45,
            'TSLA': 800.60,
            'BTC': 45000.00,
            'ETH': 3200.50
        };

        // Return mock price or generate random price between 10-1000
        return mockPrices[assetId] || Math.round((Math.random() * 990 + 10) * 100) / 100;
    }

    // Get average daily volume for an asset
    static async GetAverageDailyVolume(assetId: number): Promise<number | null> {
        // Mock average daily volume
        const mockVolumes: { [key: string]: number } = {
            'AAPL': 50000000,
            'GOOGL': 25000000,
            'MSFT': 35000000,
            'TSLA': 40000000,
            'BTC': 1000000,
            'ETH': 800000
        };

        // Return mock volume or generate random volume between 100k-10M
        return mockVolumes[assetId] || Math.floor(Math.random() * 9900000 + 100000);
    }

    // Get price history (optional - for more advanced mocking)
    static async GetPriceHistory(assetId: number): Promise<any[]> {
        // Mock price history with some sample data
        const currentPrice = await this.GetCurrentPrice(assetId) || 100;
        const history = [];

        for (let i = 0; i < 30; i++) {
            const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
            const price = Math.round(currentPrice * (1 + variance) * 100) / 100;

            history.push({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                price: price,
                volume: Math.floor(Math.random() * 1000000 + 500000)
            });
        }

        return history;
    }

    // Check if market is open (simple version)
    static async IsMarketOpen(): Promise<boolean> {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();

        // Mock: Market open Mon-Fri, 9:30 AM - 4:00 PM
        const isWeekday = day >= 1 && day <= 5;
        const isBusinessHours = hour >= 9 && hour < 16;

        return isWeekday && isBusinessHours;
    }

    static async GetMarketHours(): Promise<{ closed_days: number[], close_time: number, open_time: number }> {
        // closed_days, close_time, open_time
        // Mock market hours
        return {
            closed_days: [0, 6], // Sunday and Saturday
            close_time: 1600,
            open_time: 930
        };
    }
}