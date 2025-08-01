import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '@domain/model/Error/Error';

// The group ID for 'Administrator' from our seeder
const ADMIN_GROUP_ID = 1;

/**
 * A factory that creates an authorization middleware.
 * @param requiredPermissionId The ID of the permission from the `user_rules` table required to access the endpoint.
 */
export function authorizationMiddleware(requiredPermissionId: number) {
    
    // This is the actual Fastify preHandler that will be executed
    return async function (request: FastifyRequest, _: FastifyReply) {
        // This middleware must run *after* authMiddleware, so request.user will be available
        const user = request.user;

        if (!user) {
            // This should not happen if routes are set up correctly, but it's a good safeguard
            throw new UnauthorizedError("Authentication required.");
        }

        // Rule 1: The 'Administrator' group can access any endpoint.
        if (user.group_id === ADMIN_GROUP_ID) {
            return; // Access granted
        }

        // Rule 2: Check if the user's permissions list includes the one required for this route.
        const hasPermission = user.permissions.includes(requiredPermissionId);

        if (!hasPermission) {
            throw new UnauthorizedError("You do not have sufficient permissions to perform this action.");
        }
    };
}