import AssetController from "@adapters/inbound/controller/AssetController"
import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
// import * as Schema from "@helpers/ApiSchema/ApiSchema"

const routes: RouteOptions[] = [
    {
        method: ["GET"],
        url: "/",
        handler: AssetController.GetAssetById,
        // schema: {
        //     tags: ["User"],
        //     response: Schema.BaseResponse({
        //         type: "Array of Object",
        //         message: {
        //             id: { type: "number" },
        //             name: { type: "string" },
        //             portfolio_type: { type: "string" },
        //             target_allocation: { type: "number" },
        //             cash_balance: { type: "string" },
        //             total_value: { type: "string" },
        //             created_at: { type: "string" },
        //             updated_at: { type: "string" },
        //         },
        //     }),
        // },
    },
]

export default async function AssetRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
