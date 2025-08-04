type PortfolioType = 'retirement' | 'education' | 'general' | 'other';

export type CreatePortfolioRequest = {
    name: string
    portfolio_type: PortfolioType
    target_allocation: string
    cash_balance: number
    total_value: number
}

export type UpdatePortfolioRequest = CreatePortfolioRequest & {
    id: number
}

export type UpdatePortfolioCashBalanceRequest = {
    id: number
    cash_balance: number
}