import { Group } from "@domain/model/Groups";
import { PortfolioParamsDto } from "@domain/model/params";
import { AppDataSource } from "@infrastructure/mysql/connection";
import moment from "moment";
import { QueryRunner } from "typeorm";
import { ResultSetHeader } from "mysql2"

const db = AppDataSource;

export default class PortfolioRepository {
    static async DBGetPortfolioByUserId(user_id: number): Promise<any[]> {
        return await db.query(
            `
            SELECT p.id, p.name, p.portfolio_type, p.target_allocation, p.cash_balance, p.total_value, p.created_at, p.updated_at
            FROM portfolios p
            JOIN clients c ON p.client_id = c.id
            WHERE c.user_id = ?
            `,
            [user_id]
        );
    }

    static async DBCreatePortfolio(params: PortfolioParamsDto.CreatePortfolioParams, query_runner: QueryRunner): Promise<ResultSetHeader> {
        const { client_id, name, portfolio_type, target_allocation, cash_balance, total_value, created_at, updated_at } = params;

        return await db.query(
            `
            INSERT INTO portfolios(client_id, name, portfolio_type, target_allocation, cash_balance, total_value, created_at, updated_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [client_id, name, portfolio_type, target_allocation, cash_balance, total_value, created_at, updated_at],
            query_runner
        );
    }

    static async DBUpdatePortfolio(params: PortfolioParamsDto.UpdatePortfolioParams, query_runner: QueryRunner): Promise<ResultSetHeader> {
        const { id, name, portfolio_type, target_allocation, total_value } = params;

        return await db.query(
            `
            UPDATE portfolios
            SET name = ?, portfolio_type = ?, target_allocation = ?, total_value = ?, updated_at = ?
            WHERE id = ?
            `,
            [name, portfolio_type, target_allocation, total_value, moment.utc().format("YYYY-MM-DD HH:mm:ss"), id],
            query_runner
        );
    }

    static async DBGetPortfolioDetailsById(id: number): Promise<any> {
        const result = await db.query(
            `
            SELECT p.id, p.name, p.portfolio_type, p.target_allocation, p.cash_balance, p.total_value, p.created_at, p.updated_at, u.id as user_id, c.id as client_id
            FROM portfolios p
                JOIN clients c ON p.client_id = c.id
                JOIN users u ON c.user_id = u.id
            WHERE p.id = ? AND u.id
            `,
            [id]
        );

        if (result.length < 1) {
            throw new Error("PORTFOLIO_NOT_FOUND");
        }

        return result[0]
    }

    // DBCheckPortfolioOwnership - Modified to handle advisor access
    static async DBCheckPortfolioOwnership(id: number, client_id: number, group_id: number): Promise<boolean> {
        let result;

        if (group_id === Group.ADVISOR) { // Advisor
            // For advisors, check if the portfolio belongs to any of their clients
            result = await db.query(
                `
            SELECT COUNT(*) as count
            FROM portfolios p
            JOIN clients c ON p.client_id = c.id
            JOIN users u ON c.user_id = u.id
            WHERE p.id = ? AND c.advisor_id = ? AND u.group_id = 3
            `,
                [id, client_id] // client_id here is actually the advisor's ID
            );
        } else if (group_id === Group.CLIENT) { // Client
            // For clients, check if they own the portfolio directly
            result = await db.query(
                `
            SELECT COUNT(*) as count
            FROM portfolios p
            JOIN clients c ON p.client_id = c.id
            JOIN users u ON c.user_id = u.id
            WHERE p.id = ? AND c.id = ? AND u.group_id = ?
            `,
                [id, client_id, group_id]
            );
        } else {
            return false;
        }

        return result[0].count > 0;
    }

    static async DBUpdatePortfolioCashBalance(id: number, cash_balance: number, query_runner: QueryRunner): Promise<ResultSetHeader> {
        return await db.query(
            `
            UPDATE portfolios
            SET cash_balance = ?, updated_at = ?
            WHERE id = ?
            `,
            [cash_balance, moment.utc().format("YYYY-MM-DD HH:mm:ss"), id],
            query_runner
        );
    }
}