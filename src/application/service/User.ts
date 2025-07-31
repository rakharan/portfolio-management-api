import { LogParamsDto, UserParamsDto } from "@domain/model/params"
import LogDomainService from "@domain/service/LogDomainService"
import UserDomainService from "@domain/service/UserDomainService"
import * as UserSchema from "@helpers/JoiSchema/User"
import { AppDataSource } from "@infrastructure/mysql/connection"

export default class UserAppService {
    static async GetUserProfileService(id: number) {
        await UserSchema.GetUserProfile.validateAsync(id)

        const user = await UserDomainService.GetUserDataByIdDomain(id)

        return user
    }

    static async UpdateClientProfileService(params: UserParamsDto.UpdateClientParams, logParams: LogParamsDto.CreateLogParams) {
        await UserSchema.UpdateClientProfile.validateAsync(params)
        const { user_id, first_name, last_name, phone, risk_tolerance, investment_experience, annual_income, net_worth, investment_goals, date_of_birth } = params

        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        try {
            // Check if user exists
            const user = await UserDomainService.GetUserDataByIdDomain(user_id)

            if (!user) {
                throw new Error("User not found")
            }

            // If there are params that are not provided, set it to previous values from get user data by id domain
            const updateDataObject = {
                first_name: first_name || user.first_name,
                last_name: last_name || user.last_name,
                phone: phone || user.phone,
                risk_tolerance: risk_tolerance || user.risk_tolerance,
                investment_experience: investment_experience || user.investment_experience,
                annual_income: annual_income || user.annual_income,
                net_worth: net_worth || user.net_worth,
                investment_goals: investment_goals || user.investment_goals,
                date_of_birth: date_of_birth || user.date_of_birth
            }

            await UserDomainService.UpdateClientDataDomainService({
                user_id,
                ...updateDataObject
            }, query_runner)

            await LogDomainService.CreateLogDomain(logParams, query_runner)

            await query_runner.commitTransaction();
            query_runner.release();

            return true
        } catch (error) {
            await query_runner.rollbackTransaction();
            query_runner.release();
            throw error;
        }
    }
}