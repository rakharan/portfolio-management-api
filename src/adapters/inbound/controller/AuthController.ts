import { FastifyRequest } from "fastify"
import { UserRequestDto } from "@domain/model/request"
import moment from "moment"
import AuthAppService from "@application/service/Auth"

export default class AuthController {
    static async Register(request: FastifyRequest) {
        const { first_name, last_name, email, group_id, password } = request.body as UserRequestDto.RegisterRequest
        const register = await AuthAppService.Register({ email, first_name, last_name, password, group_id })
        return { message: register }
    }

    static async Login(request: FastifyRequest) {
        const login = await AuthAppService.Login(request.body as UserRequestDto.LoginRequest, {
            user_id: 0,
            action: `Login`,
            ip: (request.headers["x-forwarded-for"] as string) || (request.ip == "::1" ? "127.0.0.1" : request.ip),
            browser: request.headers["user-agent"],
            time: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        })
        return { message: login }
    }

    static async VerifyEmail(request: FastifyRequest) {
        const { token } = request.query as { token: string }
        const verifyEmail = await AuthAppService.VerifyEmail(token, {
            user_id: 0,
            action: `Verify Email`,
            ip: (request.headers["x-forwarded-for"] as string) || (request.ip == "::1" ? "127.0.0.1" : request.ip),
            browser: request.headers["user-agent"],
            time: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        })

        return { message: verifyEmail }
    }
}
