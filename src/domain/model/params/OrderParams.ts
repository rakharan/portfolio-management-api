import { CreateOrderRequest, OrderStatus } from "../request/OrderRequest"

export type CreateOrderParams = CreateOrderRequest & {
    client_id: number
    group_id: number
    created_at: string
    updated_at: string
    status: OrderStatus
}