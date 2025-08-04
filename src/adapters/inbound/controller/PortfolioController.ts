import PortfolioAppService from "@application/service/Portfolio";
import { PortfolioRequestDto } from "@domain/model/request";
import { FastifyRequest } from "fastify";
import moment from "moment";

export default class PortfolioController {
    static async GetPortfolioByUserIdController(request: FastifyRequest) {
        const { user_id } = request.query as { user_id: number };
        const portfolios = await PortfolioAppService.GetPortfolioByUserIdService(user_id);

        return { message: portfolios }
    }

    static async CreatePortfolioController(request: FastifyRequest): Promise<{ message: boolean }> {

        const { client_id, id } = request.user

        const { cash_balance, name, portfolio_type, target_allocation, total_value } = request.body as PortfolioRequestDto.CreatePortfolioRequest

        await PortfolioAppService.CreatePortfolioService({
            cash_balance,
            client_id,
            name,
            portfolio_type,
            target_allocation,
            total_value,
            created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            updated_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        },
            {
                user_id: id,
                action: `Create Portfolio`,
                ip: (request.headers["x-forwarded-for"] as string) || (request.ip == "::1" ? "127.0.0.1" : request.ip),
                browser: request.headers["user-agent"],
                time: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            }
        )

        return { message: true }
    }

    static async UpdatePortfolioController(request: FastifyRequest): Promise<{ message: boolean }> {

        const { name, portfolio_type, target_allocation, total_value, id } = request.body as PortfolioRequestDto.UpdatePortfolioRequest
        const { client_id, group_id } = request.user

        await PortfolioAppService.UpdatePortfolioService(
            {
                id,
                name,
                portfolio_type,
                target_allocation,
                total_value,
            },
            {
                user_id: request.user.id,
                action: `Update Portfolio`,
                ip: (request.headers["x-forwarded-for"] as string) || (request.ip == "::1" ? "127.0.0.1" : request.ip),
                browser: request.headers["user-agent"],
                time: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            },
            {
                client_id,
                group_id
            }
        )

        return { message: true }
    }

    static async GetPortfolioDetailsByIdController(request: FastifyRequest): Promise<{ message: any }> {
        const { id } = request.query as { id: number };
        const { client_id, group_id } = request.user;

        const portfolio = await PortfolioAppService.GetPortfolioDetailsByIdService({ client_id, group_id, id });

        return { message: portfolio }
    }

    static async UpdatePortfolioCashBalanceController(request: FastifyRequest): Promise<{ message: boolean }> {
        const { id, cash_balance } = request.body as PortfolioRequestDto.UpdatePortfolioCashBalanceRequest;
        const { client_id, group_id } = request.user;

        await PortfolioAppService.UpdatePortfolioCashBalanceService(
            {
                cash_balance,
                client_id,
                group_id,
                id
            },
            {
                user_id: request.user.id,
                action: `Update Portfolio Cash Balance`,
                ip: (request.headers["x-forwarded-for"] as string) || (request.ip == "::1" ? "127.0.0.1" : request.ip),
                browser: request.headers["user-agent"],
                time: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            },
        )

        return { message: true }
    }
}