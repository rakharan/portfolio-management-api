import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyJWT } from '@helpers/jwt/jwt'; // Assuming you have this helper
import Joi from 'joi';
import { UnauthorizedError } from '@domain/model/Error/Error';

// Define the shape of the data we expect inside the JWT
interface UserClaims {
    id: number;
    group_id: number;
    permissions: number[];
    client_id: number;
    first_name: string;
    last_name: string;
    email: string;
}

// Joi schema to validate the claims after decoding the token
const claimsSchema = Joi.object({
    id: Joi.number().required().min(1),
    group_id: Joi.number().required(),
    permissions: Joi.array().items(Joi.number()).required(),
}).unknown(true);


export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError("Authentication token is required.");
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.substring(7);

        // Verify the token's signature and expiration
        const userClaims = await verifyJWT<UserClaims>(token, process.env.JWT_SECRET);

        // Validate the content of the token
        await claimsSchema.validateAsync(userClaims);

        // Attach the validated claims to the request for later use
        request.user = userClaims;

    } catch (error) {
        // This will catch errors from JWT verification (e.g., expired) or Joi validation
        reply.code(401).send({ error: "Unauthorized", message: "Invalid or expired token." });
    }
}