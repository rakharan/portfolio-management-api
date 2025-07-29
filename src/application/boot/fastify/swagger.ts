import fp from "fastify-plugin"
import swagger, { SwaggerOptions } from "@fastify/swagger"
import swaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui"

export default fp((fastify, _opts, done) => {
    const options = {
        exposeRoute: true,
        swagger: {
            info: {
                title: "Wealthtech",
                version: "1.0.0",
                description: "API Doc for Wealthtech",
            },
            schemes: ["http"],
            consumes: ["application/json"],
            produces: ["application/json"],
            securityDefinitions: {
                ApiToken: {
                    type: "apiKey",
                    name: "Authorization",
                    in: "header",
                    description: "Authorization header token, sample: 'Bearer #TOKEN#'",
                },
                Secret: {
                    type: "apiKey",
                    name: "mmbsecret",
                    in: "header",
                    description: "Secret from JWT",
                },
            },
            security: [
                {
                    ApiToken: [],
                },
                {
                    Secret: [],
                },
            ],
            tags: [{ name: "Client" }, { name: "Admin" }, { name: "Product" }],
        },

        hiddenTag: "Hidden",
        hideUntagged: false,
    } as SwaggerOptions

    const optionUi = {
        staticCSP: false,
        exposeRoute: true,
        // transformSpecificationClone: true,
        routePrefix: `/documentation`,
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
            persistAuthorization: true,
        },
        transformStaticCSP: (header: never) => header,
        transformSpecification: (swaggerObject: never) => swaggerObject,
    } as FastifySwaggerUiOptions

    fastify.register(swagger, options)
    fastify.register(swaggerUi, optionUi)
    done()
})
