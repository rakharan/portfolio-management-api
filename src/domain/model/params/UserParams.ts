import { LoginRequest } from "../request/UserRequest"
import { UserRequestDto } from "../request"

export type RegisterParams = {
    email_verification_token: string
    password_hash: string
    group_id: number 
    email: string
}

export type LoginParams = LoginRequest

export type UpdateUserParams = {
    id: number
    email: string
    name: string
}

export type UpdateUserEditProfileParams = {
    id: number
    email: string
    name: string
}

export type ChangePasswordParams = {
    id: number
    oldPassword: string
    newPassword: string
}


export type UpdateClientParams = UserRequestDto.UpdateClientRequest & {
    user_id: number
}