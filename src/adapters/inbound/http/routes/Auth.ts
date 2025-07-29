import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
import AuthController from "../../controller/AuthController"
import * as Schema from "@helpers/ApiSchema/ApiSchema"

const routes: RouteOptions[] = [
    {
        method: ["POST"],
        url: "register",
        handler: AuthController.Register,
        schema: {
            tags: ["Auth"],
            body: Schema.BaseRequestSchema("Rakha", {
                first_name: { type: "string" },
                last_name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
            }),
            response: Schema.BaseResponse({
                type: "Object",
                message: {
                    message: { type: "string" },
                },
            }),
        },
    },
    {
        method: ["POST"],
        url: "login",
        handler: AuthController.Login,
        schema: {
            tags: ["Auth"],
            body: Schema.BaseRequestSchema("Rakha", {
                email: { type: "string" },
                password: { type: "string" },
            }),
            response: Schema.BaseResponse({
                type: "Object",
                message: {
                    token: { type: "string" },
                    user: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            first_name: { type: "string", nullable: true },
                            last_name: { type: "string", nullable: true },
                            email: { type: "string" },
                            created_at: { type: "number" },
                            updated_at: { type: "number" },
                            group_id: { type: "number" },
                            permissions: { type: "array", items: { type: "number" } },
                        },
                    },
                },
            }),
        },
    },
    {
        method: ["GET"],
        url: "/verify-email/:token",
        handler: AuthController.VerifyEmail,
        // schema: {
        //     tags: ["Auth"],
        //     params: { token: { type: "string" } },
        //     response: Schema.BaseResponse({ type: "Boolean" }),
        // },
    },
]

export default async function AuthRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
