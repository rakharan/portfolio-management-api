import UserAppService from "@application/service/User"
import { FastifyRequest } from "fastify"

export default class UserController {
    static async GetUserProfile(request: FastifyRequest) {
        const { id } = request.user
        const getUserProfile = await UserAppService.GetUserProfileService(id)

        const result = { message: getUserProfile }
        return result
    }
}