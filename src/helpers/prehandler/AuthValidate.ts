import { FastifyRequest } from "fastify"
import { verifyJWT } from "@helpers/jwt/jwt"
import Joi from "joi"
import { UnauthorizedError } from "@domain/model/Error/Error"
import DotenvFlow from "dotenv-flow"
import path from "path"
import { User } from "@domain/model/BaseClass/User"
import { UserClaimsResponse } from "@domain/model/response/UserResponse"

DotenvFlow.config({ path: path.resolve(__dirname, `../../../`) })

declare module "fastify" {
    interface UserClaims {
        id: number
        client_id: number
        first_name: string
        last_name: string
        email: string
        group_id: number
        permissions: number[]
    }

    interface FastifyRequest {
        user: UserClaims
    }
}

type AuthorizeParams = {
    rules: number
    user_group_id: number
    user_permissions: number[]
}
const superadmin_level = parseInt(process.env.SUPER_ADMIN_LEVEL || "0")
if (!superadmin_level) throw new Error("PLEASE_SET_SUPER_ADMIN_LEVEL_IN_ENV")

const schema = Joi.object({
    rules: Joi.number().required(),
    user_group_id: Joi.number().required(),
    user_permissions: Joi.array().items(Joi.number()).required(),
})

function authorize(data: AuthorizeParams): number {
    try {
        const { error } = schema.validate(data)
        if (error || (data.user_permissions.length < 1 && superadmin_level !== data.user_group_id)) return 0
        return superadmin_level === data.user_group_id || data.user_permissions.includes(data.rules) ? 1 : 0
    } catch (x_x) {
        console.log(x_x)
        return 0
    }
}

const checkClaims = Joi.object({
    id: Joi.number().required(),
    client_id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    group_id: Joi.number().required(),
    permissions: Joi.array().items(Joi.number()).required(),
}).unknown(true)

export async function AuthValidate(request: FastifyRequest) {
    if (!request.headers?.authorization) throw new UnauthorizedError("PLEASE_LOGIN_FIRST")

    const user_claims = await verifyJWT<UserClaimsResponse>(request.headers.authorization, process.env.JWT_SECRET)
    await checkClaims.validateAsync(user_claims)

    request.user = new User().set(user_claims)
}

export function CheckAuthAdmin({ rules }: { rules: number }) {
    return async function (request: FastifyRequest) {
        const { user } = request
        if (user.id < 1 || (rules && !authorize({ rules, user_group_id: user.group_id, user_permissions: user.permissions }))) {
            throw new UnauthorizedError(user.id < 1 ? "PLEASE_LOGIN_FIRST" : "NOT_ENOUGH_RIGHTS")
        }
    }
}
