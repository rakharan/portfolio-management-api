import UserController from "@adapters/inbound/controller/UserController"
import { AuthValidate } from "@helpers/prehandler/AuthValidate"
import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
import * as Schema from "@helpers/ApiSchema/ApiSchema"

const routes: RouteOptions[] = [
    {
        method: ["GET"],
        url: "profile",
        handler: UserController.GetUserProfile,
        schema: {
            tags: ["User"],
            response: Schema.BaseResponse({
                type: "Object",
                message: {
                    id: { type: "number" },
                    first_name: { type: "string" },
                    last_name: { type: "string" },
                    email: { type: "string" },
                    group_id: { type: "number" },
                    group_rules: { type: "string" },
                    phone: { type: "string", nullable: true },
                    date_of_birth: { type: "string", nullable: true },
                    risk_tolerance: { type: "string", nullable: true },
                    investment_experience: { type: "string", nullable: true },
                    annual_income: { type: "string", nullable: true },
                    net_worth: { type: "string", nullable: true },
                    investment_goals: { type: "string", nullable: true },
                    created_at: { type: "number" },
                    updated_at: { type: "number" },
                },
            }),
        },
    }
]

export default async function UserRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook("preValidation", AuthValidate)
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
