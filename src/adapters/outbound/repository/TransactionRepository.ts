import { AppDataSource } from "@infrastructure/mysql/connection";
import { QueryRunner } from "typeorm";
import { ResultSetHeader } from "mysql2";

const db = AppDataSource;

// Define a type for the creation parameters for better type safety
interface CreateTransactionParams {
    portfolio_id: number;
    asset_id: number | null; // asset_id can be null for cash transactions
    transaction_type: 'buy' | 'sell' | 'dividend' | 'interest' | 'fee' | 'deposit' | 'withdrawal';
    quantity: number | null;
    price: number | null;
    amount: number;
    fee: number;
    transaction_date: string;
    notes?: string;
}

export default class TransactionRepository {
    /**
     * Creates a new transaction record in the database.
     * This is the final ledger entry for a financial event.
     */
    static async DBCreateTransaction(
        params: CreateTransactionParams,
        query_runner: QueryRunner
    ): Promise<ResultSetHeader> {
        if (!query_runner?.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        const result = await db.query<ResultSetHeader>(
            `INSERT INTO transactions 
                (portfolio_id, asset_id, transaction_type, quantity, price, amount, fee, transaction_date, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                params.portfolio_id,
                params.asset_id,
                params.transaction_type,
                params.quantity,
                params.price,
                params.amount,
                params.fee,
                params.transaction_date,
                params.notes // Can be null
            ],
            query_runner
        );

        if (result.affectedRows < 1) {
            throw new Error("FAILED_TO_CREATE_TRANSACTION");
        }

        return result;
    }


    static async DBGetTransactionsByPortfolioId(
        portfolioId: number,
        limit: number = 20,
        offset: number = 0
    ): Promise<any[]> {
        const [rows] = await db.query<any[]>(
            `
            SELECT 
                t.id,
                t.transaction_type,
                t.amount,
                t.fee,
                t.transaction_date,
                t.quantity,
                t.price,
                a.symbol as asset_symbol,
                a.name as asset_name
            FROM transactions t
            LEFT JOIN assets a ON t.asset_id = a.id
            WHERE t.portfolio_id = ?
            ORDER BY t.transaction_date DESC
            LIMIT ?
            OFFSET ?
            `,
            [portfolioId, limit, offset]
        );

        return rows;
    }
}