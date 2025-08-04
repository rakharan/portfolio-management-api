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

    static async GetPortfolioDetailsByIdDomain(id: number, query_runner?: QueryRunner): Promise<any> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_UPDATE_PORTFOLIO");
        }

        const portfolio = await PortfolioRepository.DBGetPortfolioDetailsById(id, query_runner);
        if (!portfolio) {
            throw new Error("PORTFOLIO_NOT_FOUND");
        }

        return portfolio
    }

    static async CheckPortfolioOwnershipDomain(id: number, client_id: number, group_id: number, query_runner?: QueryRunner): Promise<boolean> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_CHECK_OWNERSHIP");
        }

        const isOwner = await PortfolioRepository.DBCheckPortfolioOwnership(id, client_id, group_id, query_runner);
        if (!isOwner) {
            throw new Error("YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PORTFOLIO");
        }
        return true;
    }

    static async UpdatePortfolioCashBalanceDomain(id: number, cash_balance: number, query_runner?: QueryRunner): Promise<void> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_UPDATE_CASH_BALANCE");
        }

        const result = await PortfolioRepository.DBUpdatePortfolioCashBalance(id, cash_balance, query_runner);

        if (result.affectedRows < 1) {
            throw new Error("FAILED_TO_UPDATE_CASH_BALANCE");
        }
    }

    static async GetPortfolioCashBalanceDomain(id: number, query_runner?: QueryRunner): Promise<number> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_GET_CASH_BALANCE");
        }

        const cashBalance = await PortfolioRepository.DBGetPortfolioCashBalance(id, query_runner);
        if (cashBalance === null || cashBalance === undefined) {
            throw new Error("PORTFOLIO_CASH_BALANCE_NOT_FOUND");
        }

        return cashBalance;
    }

    static async ReserveFundsDomain(
        id: number,
        amount: number,
        query_runner?: QueryRunner
    ): Promise<void> {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_RESERVE_FUNDS");
        }

        const result = await PortfolioRepository.DBReserveFunds(id, amount, query_runner);

        if (result.affectedRows < 1) {
            throw new Error("FAILED_TO_RESERVE_FUNDS");
        }
    }

    static async GetAssetHoldingsByPortfolioIdDomain(
        id: number,
        asset_id: number,
        query_runner?: QueryRunner) {
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_GET_ASSET_HOLDINGS");
        }
        const holdings = await PortfolioRepository.DBGetAssetHoldingsByPortfolioId(id, asset_id, query_runner);
        if (holdings.length < 1) {
            throw new Error("NO_ASSET_HOLDINGS_FOUND");
        }

        return holdings[0]
    }

    static async ReserveAssetsDomain(porto_id: number, asset_id: number, quantity: number, query_runner?: QueryRunner){
        if (query_runner && !query_runner.isTransactionActive) {
            throw new Error("MUST_BE_IN_TRANSACTION_TO_RESERVE_ASSETS");
        }

        const result = await PortfolioRepository.DBReserveAssets(porto_id, asset_id, quantity, query_runner);

        if (result.affectedRows < 1) {
            throw new Error("FAILED_TO_RESERVE_ASSETS");
        }
    }
    
}