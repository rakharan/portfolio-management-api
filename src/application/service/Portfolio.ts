import { Group } from "@domain/model/Groups";
import { LogParamsDto, PortfolioParamsDto } from "@domain/model/params";
import LogDomainService from "@domain/service/LogDomainService";
import PortfolioDomainService from "@domain/service/PortfolioDomainService";
import { AppDataSource } from "@infrastructure/mysql/connection";

export default class PortfolioAppService {
    static async GetPortfolioByUserIdService(user_id: number): Promise<any[]> {
        return await PortfolioDomainService.GetPortfolioByUserIdDomain(user_id);
    }

    static async CreatePortfolioService(params: PortfolioParamsDto.CreatePortfolioParams, logData: LogParamsDto.CreateLogParams): Promise<boolean> {

        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        try {

            await PortfolioDomainService.CreatePortfolioDomain(params, query_runner);

            // Log the portfolio creation action
            await LogDomainService.CreateLogDomain({ ...logData, user_id: logData.user_id }, query_runner)

            await query_runner.commitTransaction();
            query_runner.release();

            return true
        } catch (error) {
            await query_runner.rollbackTransaction();
            query_runner.release();
            throw error;
        }
    }

    static async UpdatePortfolioService(
        params: PortfolioParamsDto.UpdatePortfolioParams,
        logData: LogParamsDto.CreateLogParams,
        { group_id, client_id }: { group_id: number; client_id: number }
    ): Promise<boolean> {

        // Define user roles based on group_id
        const SUPER_ADMIN_LEVEL = 1;
        const ADVISOR_LEVEL = 2;
        const CLIENT_LEVEL = 3;

        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        try {
            // First, check if the portfolio exists and get current data
            const existingPortfolio = await PortfolioDomainService.GetPortfolioDetailsByIdDomain(params.id);
            if (!existingPortfolio) {
                throw new Error("PORTFOLIO_NOT_FOUND");
            }

            // Check permissions (similar to GetPortfolioDetailsByIdService)
            if (group_id !== SUPER_ADMIN_LEVEL) {
                // For non-super admin users, check ownership using the domain service
                try {
                    await PortfolioDomainService.CheckPortfolioOwnershipDomain(params.id, client_id, group_id);
                } catch (error) {
                    // Re-throw with more specific error message based on role
                    if (group_id === ADVISOR_LEVEL) {
                        throw new Error("PORTFOLIO_NOT_FOUND_OR_YOU_DO_NOT_HAVE_PERMISSION_TO_UPDATE_THIS_PORTFOLIO");
                    } else if (group_id === CLIENT_LEVEL) {
                        throw new Error("PORTFOLIO_NOT_FOUND_OR_YOU_DO_NOT_HAVE_PERMISSION_TO_UPDATE_THIS_PORTFOLIO");
                    } else {
                        throw new Error("INVALID_USER_ROLE");
                    }
                }
            }

            // Merge existing data with new params (partial update support)
            const updateParams: PortfolioParamsDto.UpdatePortfolioParams = {
                id: params.id,
                // Use provided values or fall back to existing values
                name: params.name || existingPortfolio.name,
                portfolio_type: params.portfolio_type || existingPortfolio.portfolio_type,
                target_allocation: params.target_allocation || existingPortfolio.target_allocation,
                cash_balance: params.cash_balance !== undefined ? params.cash_balance : existingPortfolio.cash_balance,
                total_value: params.total_value !== undefined ? params.total_value : existingPortfolio.total_value,
            };

            // Update the portfolio with merged data
            await PortfolioDomainService.UpdatePortfolioDomain(updateParams, query_runner);

            // Log the portfolio update action
            await LogDomainService.CreateLogDomain({ ...logData, user_id: logData.user_id }, query_runner);

            await query_runner.commitTransaction();
            query_runner.release();

            return true;
        } catch (error) {
            await query_runner.rollbackTransaction();
            query_runner.release();
            throw error;
        }
    }

    static async GetPortfolioDetailsByIdService({ id, group_id, client_id }: { id: number; group_id: number; client_id: number }): Promise<any> {

        /**
         * * Validate if the user has permission to view the portfolio details
         * * This can be done by checking the user's group_id and client_id against the portfolio's group_id and client_id.
         * * If the user does not have permission, throw an error.
         * 
         * If the user requesting is a super admin, they can view all portfolios.
         * If the user is not a super admin, check if the portfolio belongs to the user's client_id and group_id.
         * If the user is an advisor, they can view portfolios of their clients.
         * If the user is a client, they can only view their own portfolio.
        */

        // Check if the user is a super admin
        if (group_id === Group.SUPER_ADMIN) {
            // Super admin can view all portfolios
            const portfolio = await PortfolioDomainService.GetPortfolioDetailsByIdDomain(id);
            if (!portfolio) {
                throw new Error("PORTFOLIO_NOT_FOUND");
            }
            return portfolio;
        }

        // Handle different user roles
        if (group_id === Group.ADVISOR) {
            // Advisor can view portfolios of their clients (clients have group_id = 3)
            // We need to check if the portfolio belongs to ANY client (group_id = 3)
            // Since the DB query requires a specific client_id, we need to get the portfolio's actual client_id first
            // or modify the approach

            // First, get the portfolio to check if it exists and get its client_id
            const portfolio = await PortfolioDomainService.GetPortfolioDetailsByIdDomain(id);
            if (!portfolio) {
                throw new Error("PORTFOLIO_NOT_FOUND");
            }

            // Now check if the portfolio's client has group_id = 3 (is a regular client)
            // This assumes the portfolio object has a client_id property
            const portfolioCheck = await PortfolioDomainService.CheckPortfolioOwnershipDomain(id, portfolio.client_id, Group.CLIENT);

            if (!portfolioCheck) {
                throw new Error("YOU_DO_NOT_HAVE_PERMISSION_TO_VIEW_THIS_PORTFOLIO");
            }

            return portfolio;

        } else if (group_id === Group.CLIENT) {
            // Client can only view their own portfolio
            // For clients, group_id should equal client_id (both should be their user ID)

            // Check if the portfolio belongs to this specific client
            const portfolioCheck = await PortfolioDomainService.CheckPortfolioOwnershipDomain(id, client_id, Group.CLIENT);

            if (!portfolioCheck) {
                throw new Error("PORTFOLIO_NOT_FOUND_OR_YOU_DO_NOT_HAVE_PERMISSION_TO_VIEW_THIS_PORTFOLIO");
            }

            // Get and return the portfolio
            const portfolio = await PortfolioDomainService.GetPortfolioDetailsByIdDomain(id);
            if (!portfolio) {
                throw new Error("PORTFOLIO_NOT_FOUND");
            }

            return portfolio;

        } else {
            // Unknown group_id
            throw new Error("INVALID_USER_ROLE");
        }
    }

    static async UpdatePortfolioCashBalanceService(params: PortfolioParamsDto.UpdatePortfolioCashBalanceParams, logData: LogParamsDto.CreateLogParams): Promise<boolean> {
        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();
        try {

            // Check if the portfolio exists
            const existingPortfolio = await PortfolioDomainService.GetPortfolioDetailsByIdDomain(params.id);
            if (!existingPortfolio) {
                throw new Error("PORTFOLIO_NOT_FOUND");
            }

            // Check if the user has permission to update the cash balance
            await PortfolioDomainService.CheckPortfolioOwnershipDomain(params.id, params.client_id, params.group_id);

            // Update the cash balance
            await PortfolioDomainService.UpdatePortfolioCashBalanceDomain(params.id, params.cash_balance, query_runner);
            
            // Log the cash balance update action
            await LogDomainService.CreateLogDomain({ ...logData, user_id: logData.user_id }, query_runner);

            await query_runner.commitTransaction();
            query_runner.release();

            return true;
        } catch (error) {
            await query_runner.rollbackTransaction();
            query_runner.release();
            throw error;
        }
    }
}