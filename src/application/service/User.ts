import UserDomainService from "@domain/service/UserDomainService"
import * as UserSchema from "@helpers/JoiSchema/User"

export default class UserAppService {
    static async GetUserProfileService(id: number) {
        await UserSchema.GetUserProfile.validateAsync(id)

        const user = await UserDomainService.GetUserDataByIdDomain(id)

        return user
    }
}