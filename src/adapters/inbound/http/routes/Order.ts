import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
import * as Schema from "@helpers/ApiSchema/ApiSchema"
import { AuthValidate } from "@helpers/prehandler/AuthValidate"
import OrderController from "@adapters/inbound/controller/OrderController"

const routes: RouteOptions[] = [
    {
        method: ["POST"],
        url: "/",
        handler: OrderController.CreateOrder,
        schema: {
            tags: ["User"],
            body: Schema.BaseRequestSchema("Create Order", {
                portfolio_id: { type: "number", default: "" },
                asset_id: { type: "number", default: "" },
                side: { type: "string", default: "" },
                order_type: { type: "string", default: "" },
                quantity: { type: "number", default: "" },
                price: { type: "number", default: "" },
                stop_loss: { type: "number", default: "" },
                take_profit: { type: "number", default: "" },
                order_value: { type: "number", default: "" },
                notes: { type: "string", default: "" },
                expires_at: { type: "string", default: "" },
                broker_order_id: { type: "number", default: "" },
            }),
            response: Schema.BaseResponse({
                type: "Object",
                message: {
                    message: { type: "string" },
                    order_id: { type: "number" },
                    status: { type: "string" },
                },
            }),
        },
    },
]

export default async function OrderRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook("preValidation", AuthValidate)
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
