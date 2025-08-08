export type OrderStatus = 'PENDING' | 'OPEN' | 'PARTIAL_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED' | 'EXPIRED'
type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT'
type OrderSide = 'BUY' | 'SELL'

export type CreateOrderRequest = {
    portfolio_id: number
    asset_id: number
    side: OrderSide
    order_type: OrderType
    quantity: number
    price?: number
    stop_loss?: number
    take_profit?: number
    order_value?: number
    notes?: string
    expires_at?: string
    broker_order_id?: number
    filled_quantity?: number
    average_fill_price?: number
    close_price?: number
    fees?: number
    closed_at?: string
}