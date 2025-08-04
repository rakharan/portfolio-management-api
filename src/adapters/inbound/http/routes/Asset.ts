import AssetController from "@adapters/inbound/controller/AssetController"
import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
import * as Schema from "@helpers/ApiSchema/ApiSchema"

const routes: RouteOptions[] = [
    {
        method: ["GET"],
        url: "/",
        handler: AssetController.GetAssetById,
        schema: {
            tags: ["User"],
            response: Schema.BaseResponse({
                type: "Object",
                message: {
                    id: { type: "number" },
                    symbol: { type: "string" },
                    name: { type: "string" },
                    asset_type: { type: "string" },
                    sector: { type: "string" },
                    currency: { type: "string" },
                    current_price: { type: "string" },
                    price_updated_at: { type: "string" },
                    created_at: { type: "string" },
                    updated_at: { type: "string" },
                },
            }),
        },
    },
]

export default async function AssetRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
