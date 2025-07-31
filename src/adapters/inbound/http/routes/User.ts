import UserController from "@adapters/inbound/controller/UserController"
import { AuthValidate } from "@helpers/prehandler/AuthValidate"
import { FastifyInstance, FastifyPluginOptions, RouteOptions } from "fastify"
// import * as Schema from "@helpers/ApiSchema/ApiSchema"

const routes: RouteOptions[] = [
    {
        method: ["GET"],
        url: "profile",
        handler: UserController.GetUserProfile,
        // schema: {
        //     tags: ["User"],
        //     response: Schema.BaseResponse({
        //         type: "Object",
        //         message: {
        //             id: { type: "number" },
        //             name: { type: "string" },
        //             email: { type: "string" },
        //             level: { type: "number" },
        //             created_at: { type: "number" },
        //             group_rules: { type: "string" },
        //         },
        //     }),
        // }, 
    }
]

export default async function UserRoute(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook("preValidation", AuthValidate)
    for (const route of routes) {
        fastify.route({ ...route, config: options })
    }
}
