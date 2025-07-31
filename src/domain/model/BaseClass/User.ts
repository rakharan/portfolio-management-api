
import UserDomainService from "@domain/service/UserDomainService"
import { UserClaimsResponse } from "../response/UserResponse"

export class User {
    id: number
    name: string
    email: string
    group_id: number
    permissions: number[]

    constructor(id = 0, name = "", email = "", group_id = 0, permissions = []) {
        this.id = id
        this.name = name
        this.email = email
        this.group_id = group_id
        this.permissions = permissions
    }

    set(params: UserClaimsResponse): this {
        ({ id: this.id, group_id: this.group_id, permissions: this.permissions } = params)
        return this
    }

    get() {
        return {
            id: this.id,
            group_id: this.group_id,
            permissions: this.permissions,
        }
    }

    static async getUserData(id: number) {
        return UserDomainService.GetUserDataByIdDomain(id)
    }
}
