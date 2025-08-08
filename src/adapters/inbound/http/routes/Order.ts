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
                portfolio_id: { type: "number" },
                asset_id: { type: "number" },
                side: { type: "string" },
                order_type: { type: "string" },
                quantity: { type: "number" },
                price: { type: "number" },
                stop_loss: { type: "number" },
                take_profit: { type: "number" },
                order_value: { type: "number" },
                notes: { type: "string" },
                expires_at: { type: "string" },
                broker_order_id: { type: "number" },
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
