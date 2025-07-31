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
}