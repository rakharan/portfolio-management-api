import fastify from "fastify"
import Ajv from "ajv"
import cors from '@fastify/cors'
import { AppDataSource } from "@infrastructure/mysql/connection"

function ajvFilePlugin(ajv: Ajv) {
    return ajv.addKeyword({
        keyword: "isFile",
        compile: (_schema, parent) => {
            parent.type = "file"
            parent.format = "binary"
            delete parent.isFile
            return (field) => !!field.file
        },
        error: {
            message: "should be a file",
        },
    })
}

function buildServer() {
    const server = fastify({
        logger: {
            transport: {
                target: "pino-pretty",
            },
        },
        ajv: { plugins: [ajvFilePlugin] },
    })

    server.register(cors, {
        methods: ["PUT", "GET", "POST"],
        allowedHeaders: ['Content-Type', 'Authorization']
    })

    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err: any) => {
            console.log({ err })
            console.error("Error during Data Source initialization", err)
        })

    return server
}

async function main() {
    try {

        const port = Number(process.env.PORT) || 3000
        const server = buildServer()

        server.listen({ port }, (err, address) => {
            if (err) {
                console.error("Error starting server:", err)
                process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        })

    } catch (error) {
        console.error("Error in main function:", error)
        process.exit(1)
    }
}

main()