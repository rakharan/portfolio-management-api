import UserDomainService from "@domain/service/UserDomainService"
import { UserClaimsResponse } from "../response/UserResponse"

export class User {
    id: number
    client_id: number
    first_name: string
    last_name: string
    email: string
    group_id: number
    permissions: number[]

    constructor(id = 0, first_name = "", last_name = "", client_id = 0, email = "", group_id = 0, permissions = []) {
        this.id = id
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.group_id = group_id
        this.permissions = permissions
        this.client_id = client_id
    }

    set(params: UserClaimsResponse): this {
        ({
            id: this.id,
            group_id: this.group_id,
            permissions: this.permissions,
            client_id: this.client_id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
        } = params)
        return this
    }

    get() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            client_id: this.client_id,
            group_id: this.group_id,
            permissions: this.permissions,
        }
    }

    static async getUserData(id: number) {
        return UserDomainService.GetUserDataByIdDomain(id)
    }
}
