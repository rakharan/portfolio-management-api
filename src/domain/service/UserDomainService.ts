import UserRepository from "@adapters/outbound/repository/UserRepository"
import { ApiError, BadInputError, ResultNotFoundError } from "@domain/model/Error/Error"
import { UserParamsDto } from "@domain/model/params"
import { UserResponseDto } from "@domain/model/response"
import { QueryRunner } from "typeorm"

export default class UserDomainService {
    static async CreateUserDomain(user: UserParamsDto.RegisterParams, query_runner?: QueryRunner) {
        if (!query_runner?.isTransactionActive) {
            throw new ApiError("MUST_IN_TRANSACTION")
        }

        const createUser = await UserRepository.DBCreateUser(user, query_runner)
        if (createUser.affectedRows < 1) {
            throw new ApiError("FAILED_TO_CREATE_USER")
        }
        return createUser
    }

    static async GetEmailExistDomain(email: string): Promise<UserResponseDto.GetEmailExistResult[]> {
        const result = await UserRepository.DBGetEmailExist(email)

        if (result.length > 0) {
            throw new BadInputError("EMAIL_ALREADY_EXISTS")
        }

        return result
    }

    static async CheckUserExistsDomain(email: string) {
        const user = await UserRepository.DBCheckUserExists(email)
        if (user.length < 1) {
            throw new ResultNotFoundError("ACCOUNT_NOT_FOUND")
        }
        return user[0]
    }

    static async GetUserDataByIdDomain(id: number) {
        const result = await UserRepository.DBGetUserDataById(id)
        if (result.length < 1) {
            throw new ResultNotFoundError("USER_NOT_FOUND")
        }

        return result[0]
    }

    static async GetUserByIdDomain(id: number, query_runner?: QueryRunner) {
        if (!query_runner?.isTransactionActive) {
            throw new ApiError("MUST_IN_TRANSACTION")
        }

        const result = await UserRepository.DBGetUserById(id, query_runner)
        if (result.length < 1) {
            throw new ApiError("USER_NOT_FOUND")
        }

        return result[0]
    }

    static async GetUserEmailExistDomainService(email: string) {
        return await UserRepository.DBGetUserEmailExist(email)
    }

    static async UpdateUserEditProfileDomainService(params: UserParamsDto.UpdateUserEditProfileParams, query_runner?: QueryRunner) {
        if (!query_runner?.isTransactionActive) {
            throw new ApiError("MUST_IN_TRANSACTION")
        }

        const result = await UserRepository.DBUpdateUserEditProfile(params, query_runner)
        if (result.affectedRows < 1) {
            throw new ApiError("FAILED_TO_EDIT_PROFILE")
        }
        return result
    }

    static async GetUserPasswordByIdDomain(id: number) {
        const result = await UserRepository.DBGetUserPasswordById(id)
        if (result.length < 1) {
            throw new ResultNotFoundError("USER_NOT_FOUND")
        }

        return result[0]
    }

    static async UpdatePasswordDomain(passEncrypt: string, id: number, query_runner?: QueryRunner) {
        if (!query_runner?.isTransactionActive) {
            throw new ApiError("MUST_IN_TRANSACTION")
        }

        const result = await UserRepository.DBUpdatePassword(passEncrypt, id, query_runner)
        if (result.affectedRows < 1) {
            throw new ApiError("FAILED_TO_CHANGE_PASSWORD")
        }
        return true
    }

    static async FindUserByTokenDomain(token: string) {
        const user = await UserRepository.DBFindUserByToken(token)
        if (user.length < 1) {
            throw new ResultNotFoundError("USER_NOT_FOUND")
        }
        return user[0]
    }

    static async VerifyEmailDomain(email: string, query_runner: QueryRunner) {
        if (!query_runner?.isTransactionActive) {
            throw new ApiError("MUST_IN_TRANSACTION")
        }

        const verify = await UserRepository.DBVerifyEmail(email, query_runner)
        if (verify.affectedRows < 1) {
            throw new ApiError("FAILED_TO_VERIFY_EMAIL")
        }
    }
}
