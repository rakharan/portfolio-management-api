import { AppDataSource } from "@infrastructure/mysql/connection";
import { QueryRunner } from "typeorm";
import { ResultSetHeader } from "mysql2";

// Assumes you have a DTO for client creation parameters
interface ClientCreationParams {
    user_id: number;
    first_name: string;
    last_name: string;
}

const db = AppDataSource;

export default class ClientRepository {
    /**
     * Creates a new client profile in the database.
     * @param client The client data to insert.
     * @param query_runner The active database transaction runner.
     */
    static async DBCreateClient(client: ClientCreationParams, query_runner: QueryRunner): Promise<ResultSetHeader> {
        const result = await db.query<ResultSetHeader>(
            `
            INSERT INTO clients (user_id, first_name, last_name) 
            VALUES (?, ?, ?)
            `,
            [client.user_id, client.first_name, client.last_name],
            query_runner
        );
        return result;
    }

    /**
     * Retrieves a client's profile using their user_id.
     * @param user_id The ID of the user to find the client profile for.
     */
    static async DBGetClientByUserId(user_id: number): Promise<any | null> {
        const [rows] = await db.query<any[]>(
            `SELECT * FROM clients WHERE user_id = ?`,
            [user_id]
        );
        return rows[0] || null;
    }
}