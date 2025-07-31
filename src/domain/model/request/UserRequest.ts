export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';
export type InvestmentExperience = 'beginner' | 'intermediate' | 'experienced';

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

export type UpdateClientRequest = {
    first_name: string
    last_name: string
    phone: string
    risk_tolerance: RiskTolerance
    investment_experience: InvestmentExperience
    annual_income: number
    net_worth: number
    investment_goals: string
    date_of_birth: string
}