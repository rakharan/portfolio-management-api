import { CreatePortfolioRequest, UpdatePortfolioCashBalanceRequest } from "../request/PortfolioRequest";

export type CreatePortfolioParams = CreatePortfolioRequest & {
    client_id: number
    updated_at: string
    created_at: string
}

export type UpdatePortfolioParams = {
    id: number
    name: string
    portfolio_type: string
    target_allocation: string
    total_value: number
}

export type UpdatePortfolioCashBalanceParams = UpdatePortfolioCashBalanceRequest & {
    group_id: number
    client_id: number
}