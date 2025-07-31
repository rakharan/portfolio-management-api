import { CreatePortfolioRequest } from "../request/PortfolioRequest";

export type CreatePortfolioParams = CreatePortfolioRequest & {
    client_id: number
    updated_at: string
    created_at: string
}