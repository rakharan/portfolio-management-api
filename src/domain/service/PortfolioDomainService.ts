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

    static async UpdatePortfolioDomain(params: PortfolioParamsDto.UpdatePortfolioParams, query_runner?: QueryRunner): Promise<void> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("Must be in a transaction to update a portfolio.");
        }

        const result = await PortfolioRepository.DBUpdatePortfolio(params, query_runner);

        if (result.affectedRows < 1) {
            throw new Error("Failed to update portfolio.");
        }
    }

    static async GetPortfolioDetailsByIdDomain(id: number): Promise<any> {
        const portfolio = await PortfolioRepository.DBGetPortfolioDetailsById(id);
        if (!portfolio) {
            throw new Error("Portfolio not found.");
        }

        return portfolio
    }

    // CheckPortfolioOwnership
    static async CheckPortfolioOwnershipDomain(id: number, client_id: number, group_id: number): Promise<boolean> {
        const isOwner = await PortfolioRepository.DBCheckPortfolioOwnership(id, client_id, group_id);
        if (!isOwner) {
            throw new Error("You do not own this portfolio.");
        }
        return true;
    }
}