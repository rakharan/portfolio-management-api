import { AuthRoute } from "@adapters/inbound/http/routes"
import fp from "fastify-plugin"

export default fp(async (fastify) => {
    await fastify.register(AuthRoute, { prefix: "/api/v1/auth/" })
})
