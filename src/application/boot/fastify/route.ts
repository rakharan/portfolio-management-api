import { AuthRoute, PortfolioRoute, UserRoute } from "@adapters/inbound/http/routes"
import fp from "fastify-plugin"

export default fp(async (fastify) => {
    await fastify.register(AuthRoute, { prefix: "/api/v1/auth/" })
    await fastify.register(UserRoute, { prefix: "/api/v1/user/" })
    await fastify.register(PortfolioRoute, { prefix: "/api/v1/portfolio/" })
})
