import { AuthValidate } from "@helpers/prehandler/AuthValidate"
import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
import * as Schema from "@helpers/ApiSchema/ApiSchema"
import PortfolioController from "@adapters/inbound/controller/PortfolioController"

const routes: RouteOptions[] = [
    {
        method: ["GET"],
        url: "/",
        handler: PortfolioController.GetPortfolioByUserIdController,
        schema: {
            tags: ["User"],
            response: Schema.BaseResponse({
                type: "Array of Object",
                message: {
                    id: { type: "number" },
                    name: { type: "string" },
                    portfolio_type: { type: "string" },
                    target_allocation: { type: "number" },
                    cash_balance: { type: "string" },
                    total_value: { type: "string" },
                    created_at: { type: "string" },
                    updated_at: { type: "string" },
                },
            }),
        },
    },
    {
        method: ["POST"],
        url: "/",
        handler: PortfolioController.CreatePortfolioController,
        // schema: {
        //     tags: ["User"],
        //     body: Schema.BaseRequestSchema("Rakha", {
        //         first_name: { type: "string", default: "" },
        //         last_name: { type: "string", default: "" },
        //         phone: { type: "string", default: "" },
        //         risk_tolerance: { type: "string", default: "" },
        //         investment_experience: { type: "string", default: "" },
        //         annual_income: { type: "string", default: "" },
        //         net_worth: { type: "string", default: "" },
        //         investment_goals: { type: "string", default: "" },
        //         date_of_birth: { type: "string", default: "" },
        //     }),
        //     response: Schema.BaseResponse({ type: "Boolean" }),
        // },
    }

]

export default async function UserRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook("preValidation", AuthValidate)
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
