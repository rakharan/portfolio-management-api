import { CreateOrderRequest, OrderStatus } from "../request/OrderRequest"

export type CreateOrderParams = CreateOrderRequest & {
    client_id: number
    group_id: number | null
    created_at: string
    updated_at: string
    status: OrderStatus
    filled_quantity?: number
    average_fill_price?: number | null
    close_price?: number | null
    fees?: number
    closed_at?: string | null
}