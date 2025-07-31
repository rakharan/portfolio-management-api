import { AppDataSource } from "@infrastructure/mysql/connection";
import { QueryRunner } from "typeorm";
import { UserResponseDto } from "@domain/model/response";
import { UserParamsDto } from "@domain/model/params";
import { ResultSetHeader } from "mysql2";
import moment from "moment";

const db = AppDataSource;

export default class UserRepository {
    static async DBCreateUser(user: UserParamsDto.RegisterParams, query_runner?: QueryRunner): Promise<ResultSetHeader> {
        const result = await db.query<ResultSetHeader>(
            `INSERT INTO users (group_id, email, password_hash, email_verification_token) VALUES (?, ?, ?, ?)`,
            [user.group_id, user.email, user.password_hash, user.email_verification_token],
            query_runner
        );
        return result;
    }

    static async DBGetEmailExist(email: string): Promise<UserResponseDto.GetEmailExistResult[]> {
        const rows = await db.query<UserResponseDto.GetEmailExistResult[]>(
            `SELECT id FROM users WHERE email = ? AND status = 'active'`,
            [email]
        );
        return rows;
    }

    static async DBCheckUserExists(email: string, query_runner?: QueryRunner): Promise<UserResponseDto.CheckUserExistResult[]> {
        const rows = await db.query<UserResponseDto.CheckUserExistResult[]>(
            `
            SELECT 
                u.id, u.email, u.password_hash, u.group_id, u.status,
                c.first_name, c.last_name
            FROM users u
            LEFT JOIN clients c ON u.id = c.user_id
            WHERE u.email = ? AND u.status <> 'suspended'
            `,
            [email],
            query_runner
        );
        return rows;
    }

    static async DBGetUserDataById(id: number, query_runner?: QueryRunner): Promise<UserResponseDto.GetUserDataByIdResult[]> {
        const rows = await db.query<UserResponseDto.GetUserDataByIdResult[]>(
            `
            SELECT 
                u.id, u.email, u.group_id, c.first_name, c.last_name,
                GROUP_CONCAT(DISTINCT d.rule_id separator ',') as group_rules,
                c.phone, c.date_of_birth, c.risk_tolerance, c.investment_experience, c.annual_income, c.net_worth, c.investment_goals, c.created_at, c.updated_at
            FROM users u
            LEFT JOIN user_group_rules d ON u.group_id = d.group_id
            LEFT JOIN clients c ON u.id = c.user_id
            WHERE u.id = ?
            GROUP BY u.id
            `,
            [id],
            query_runner
        );
        return rows;
    }

    static async DBUpdateUserEditProfile(params: { email: string, id: number }, query_runner?: QueryRunner): Promise<ResultSetHeader> {
        const result = await db.query<ResultSetHeader>(
            `UPDATE users SET email = ?, updated_at = ? WHERE id = ?`,
            [moment.utc().format("YYYY-MM-DD HH:mm:ss"), params.email, params.id],
            query_runner
        );
        return result;
    }

    static async DBGetUserPasswordById(id: number, query_runner?: QueryRunner): Promise<{ id: number; password_hash: string }[]> {
        const rows = await db.query<{ id: number; password_hash: string }[]>(
            `SELECT id, password_hash FROM users WHERE id = ?`,
            [id],
            query_runner
        );
        return rows;
    }

    static async DBUpdatePassword(passwordHash: string, id: number, query_runner?: QueryRunner): Promise<ResultSetHeader> {
        const result = await db.query<ResultSetHeader>(
            `UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`,
            [moment.utc().format("YYYY-MM-DD HH:mm:ss"), passwordHash, id],
            query_runner
        );
        return result;
    }

    static async DBFindUserByToken(token: string): Promise<any[]> {
        const rows = await db.query<any[]>(
            `SELECT id, email, status FROM users WHERE email_verification_token = ?`,
            [token]
        );
        return rows;
    }

    static async DBVerifyEmail(email: string, query_runner?: QueryRunner): Promise<ResultSetHeader> {
        const result = await db.query<ResultSetHeader>(
            `UPDATE users SET status = 'active', email_verification_token = NULL, updated_at = ? WHERE email = ?`,
            [moment.utc().format("YYYY-MM-DD HH:mm:ss"), email],
            query_runner
        );
        return result;
    }

    static DBUpdateUserLastLogin(id: number, query_runner?: QueryRunner): Promise<ResultSetHeader> {
        const result = db.query<ResultSetHeader>(
            `UPDATE users SET last_login = ? WHERE id = ?`, [moment.utc().format("YYYY-MM-DD HH:mm:ss"), id], query_runner);

        return result
    }

    static DBUpdateClientData(params: UserParamsDto.UpdateClientParams, query_runner?: QueryRunner): Promise<ResultSetHeader> {
        const result = db.query<ResultSetHeader>(
            `UPDATE clients SET first_name = ?, last_name = ?, phone = ?, risk_tolerance = ?, investment_experience = ?, annual_income = ?, net_worth = ?, investment_goals = ?, date_of_birth = ?, updated_at = ? WHERE user_id = ?`,
            [
                params.first_name,
                params.last_name,
                params.phone,
                params.risk_tolerance,
                params.investment_experience,
                params.annual_income,
                params.net_worth,
                params.investment_goals,
                params.date_of_birth,
                moment.utc().format("YYYY-MM-DD HH:mm:ss"),
                params.user_id
            ],
            query_runner
        );

        return result
    }
}