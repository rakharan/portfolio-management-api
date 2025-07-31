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
}