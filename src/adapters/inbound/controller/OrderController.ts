import OrderAppService from "@application/service/Order";
import { OrderRequestDto } from "@domain/model/request";
import { FastifyRequest } from "fastify";
import moment from "moment";

export default class OrderController {
    static async CreateOrder(request: FastifyRequest) {
        const createOrderParams = request.body as OrderRequestDto.CreateOrderRequest;
        const order = await OrderAppService.CreateOrderApp(
            {
                ...createOrderParams,
                status: "OPEN",
                created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
                updated_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
                client_id: request.user.client_id,
                group_id: request.user.group_id,
            },
            {
                user_id: request.user.id,
                action: `Create Order`,
                ip: (request.headers["x-forwarded-for"] as string) || (request.ip == "::1" ? "127.0.0.1" : request.ip),
                browser: request.headers["user-agent"],
                time: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            }
        );

        return { message: order };
    }
}