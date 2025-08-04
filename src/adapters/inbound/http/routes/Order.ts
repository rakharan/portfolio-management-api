import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
// import * as Schema from "@helpers/ApiSchema/ApiSchema"
import OrderController from "@adapters/inbound/controller/OrderController"

const routes: RouteOptions[] = [
    {
        method: ["POST"],
        url: "/",
        handler: OrderController.CreateOrder,
        // schema: {
        //     tags: ["User"],
        //     response: Schema.BaseResponse({
        //         type: "Object",
        //         message: {
        //             id: { type: "number" },
        //             symbol: { type: "string" },
        //             name: { type: "string" },
        //             asset_type: { type: "string" },
        //             sector: { type: "string" },
        //             currency: { type: "string" },
        //             current_price: { type: "string" },
        //             price_updated_at: { type: "string" },
        //             created_at: { type: "string" },
        //             updated_at: { type: "string" },
        //         },
        //     }),
        // },
    },
]

export default async function OrderRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
