import { CreatePortfolioRequest } from "../request/PortfolioRequest";

export type CreatePortfolioParams = CreatePortfolioRequest & {
    client_id: number
    updated_at: string
    created_at: string
}

export type UpdatePortfolioParams =  {
    id: number
    name: string
    portfolio_type: string
    target_allocation: string
    cash_balance: number
    total_value: number
}