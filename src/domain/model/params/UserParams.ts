import { LoginRequest } from "../request/UserRequest"

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
