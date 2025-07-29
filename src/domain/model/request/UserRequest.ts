export type RegisterRequest = {
    first_name: string
    last_name: string
    email: string
    group_id: number
    password: string
}

export type LoginRequest = {
    email: string
    password: string
}

export type UpdateUserRequest = {
    id: number
    email: string
    name: string
}

export type ChangePasswordRequest = {
    oldPassword: string
    newPassword: string
}
