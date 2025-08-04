import ClientRepository from "@adapters/outbound/repository/ClientRepository";
import { QueryRunner } from "typeorm";

// Assumes you have a DTO for client creation parameters
interface ClientCreationParams {
    user_id: number;
    first_name: string;
    last_name: string;
}

export default class ClientDomainService {
    /**
     * Orchestrates the creation of a new client profile.
     * @param clientData The data for the new client.
     * @param query_runner The active database transaction runner.
     */
    static async CreateClientDomain(clientData: ClientCreationParams, query_runner: QueryRunner) {
        if (!query_runner.isTransactionActive) {
            throw new Error("MUST_IN_TRANSACTION");
        }

        const createClient = await ClientRepository.DBCreateClient(clientData, query_runner);
        if (createClient.affectedRows < 1) {
            throw new Error("FAILED_TO_CREATE_CLIENT");
        }
    }

    /**
     * Orchestrates fetching a client profile by their user ID.
     * @param userId The user's ID.
     */
    static async GetClientByUserIdDomain(userId: number) {
        // Calls the repository to get the data.
        const client = await ClientRepository.DBGetClientByUserId(userId);

        // You could add logic here, for example, to throw an error if the client is not found.
        if (!client) {
            // Or handle this case as needed by your application
            return null;
        }

        return client;
    }
}