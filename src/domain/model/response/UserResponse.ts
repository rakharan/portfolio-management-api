import { InvestmentExperience, RiskTolerance } from "../request/UserRequest"

export type GetEmailExistResult = {
    id: number
}

export type GetUserByIdResult = {
    id: number
    name: string
    email: string
    level: number
    created_at: number
}

export type GetUserDataByIdResult = {
    id: number
    first_name: string
    last_name: string
    email: string
    group_id?: number
    created_at: number
    group_rules?: string
    phone?: string
    date_of_birth?: string
    risk_tolerance?: RiskTolerance
    investment_experience?: InvestmentExperience
    annual_income?: number
    net_worth?: number
    investment_goals?: string
    updated_at?: number
}

export type UserClaimsResponse = {
    id: number
    client_id: number
    group_id: number
    permissions: number[]
}

export type GetUserEmailExistResult = {
    email: string
}

export type GetUserPasswordByIdResult = {
    id: number
    password: string
}

export type CheckUserExistResult = {
    id: number
    client_id: number
    first_name: string
    last_name: string
    email: string
    password_hash: string
    group_id: number
    created_at: number
    status: string
}

export type FindUserByTokenResult = {
    id: number
    email: string
    is_verified: number
    email_token: string
}
