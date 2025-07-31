import UserAppService from "@application/service/User"
import { UserRequestDto } from "@domain/model/request"
import { FastifyRequest } from "fastify"
import moment from "moment"

export default class UserController {
    static async GetUserProfile(request: FastifyRequest) {
        const { id } = request.user
        const getUserProfile = await UserAppService.GetUserProfileService(id)

        const result = { message: getUserProfile }
        return result
    }

    static async UpdateClientProfileService(request: FastifyRequest) {
        const { id } = request.user

        const { annual_income, first_name, investment_experience, investment_goals, last_name, net_worth, phone, risk_tolerance, date_of_birth } = request.body as UserRequestDto.UpdateClientRequest

        const getUserProfile = await UserAppService.UpdateClientProfileService({ user_id: id, annual_income, first_name, investment_experience, investment_goals, last_name, net_worth, phone, risk_tolerance, date_of_birth },
            {
                user_id: id,
                action: "Update User Profile",
                ip: (request.headers["x-forwarded-for"] as string) || (request.ip == "::1" ? "127.0.0.1" : request.ip),
                browser: request.headers["user-agent"],
                time: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            })

        const result = { message: getUserProfile }
        return result
    }
}