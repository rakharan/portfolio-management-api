import PortfolioRepository from "@adapters/outbound/repository/PortfolioRepository";
import { PortfolioParamsDto } from "@domain/model/params";
import { QueryRunner } from "typeorm";

export default class PortfolioDomainService {
    static async GetPortfolioByUserIdDomain(user_id: number): Promise<any[]> {
        const portfolios = await PortfolioRepository.DBGetPortfolioByUserId(user_id);
        if (portfolios.length < 1) {
            throw new Error("No portfolios found for the user.");
        }

        return portfolios.map(portfolio => ({
            ...portfolio,
            target_allocation: JSON.parse(portfolio.target_allocation),
        }));
    }

    static async CreatePortfolioDomain(params: PortfolioParamsDto.CreatePortfolioParams, query_runner?: QueryRunner): Promise<void> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("Must be in a transaction to create a portfolio.");
        }

        const result = await PortfolioRepository.DBCreatePortfolio(params, query_runner);

        if (result.affectedRows < 1) {
            throw new Error("Failed to create portfolio.");
        }
    }
}