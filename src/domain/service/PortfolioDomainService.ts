import PortfolioRepository from "@adapters/outbound/repository/PortfolioRepository";
import { PortfolioParamsDto } from "@domain/model/params";
import { QueryRunner } from "typeorm";

export default class PortfolioDomainService {
    static async GetPortfolioByUserIdDomain(user_id: number): Promise<any[]> {
        const portfolios = await PortfolioRepository.DBGetPortfolioByUserId(user_id);
        if (portfolios.length < 1) {
            throw new Error("NO_PORTFOLIOS_FOUND");
        }

        return portfolios.map(portfolio => ({
            ...portfolio,
            target_allocation: JSON.parse(portfolio.target_allocation),
        }));
    }

    static async CreatePortfolioDomain(params: PortfolioParamsDto.CreatePortfolioParams, query_runner?: QueryRunner): Promise<void> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_CREATE_PORTFOLIO");
        }

        const result = await PortfolioRepository.DBCreatePortfolio(params, query_runner);

        if (result.affectedRows < 1) {
            throw new Error("FAILED_TO_CREATE_PORTFOLIO");
        }
    }

    static async UpdatePortfolioDomain(params: PortfolioParamsDto.UpdatePortfolioParams, query_runner?: QueryRunner): Promise<void> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_UPDATE_PORTFOLIO");
        }

        const result = await PortfolioRepository.DBUpdatePortfolio(params, query_runner);

        if (result.affectedRows < 1) {
            throw new Error("FAILED_TO_UPDATE_PORTFOLIO");
        }
    }

    static async GetPortfolioDetailsByIdDomain(id: number): Promise<any> {
        const portfolio = await PortfolioRepository.DBGetPortfolioDetailsById(id);
        if (!portfolio) {
            throw new Error("PORTFOLIO_NOT_FOUND");
        }

        return portfolio
    }

    // CheckPortfolioOwnership
    static async CheckPortfolioOwnershipDomain(id: number, client_id: number, group_id: number): Promise<boolean> {
        const isOwner = await PortfolioRepository.DBCheckPortfolioOwnership(id, client_id, group_id);
        if (!isOwner) {
            throw new Error("YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PORTFOLIO");
        }
        return true;
    }
}