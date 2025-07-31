import { PortfolioParamsDto } from "@domain/model/params";
import { AppDataSource } from "@infrastructure/mysql/connection";
import { QueryRunner } from "typeorm";

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

    static async DBCreatePortfolio(params: PortfolioParamsDto.CreatePortfolioParams, query_runner: QueryRunner) {
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
}