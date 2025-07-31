import { AppDataSource } from "@infrastructure/mysql/connection";
import { LogParamsDto, UserParamsDto } from "@domain/model/params";
import UserDomainService from "@domain/service/UserDomainService";
import ClientDomainService from "@domain/service/ClientDomainService"; // Import the new service
import * as UserSchema from "@helpers/JoiSchema/User";
import { checkPassword, hashPassword } from "@helpers/Password/Password";
import { signJWT, verifyJWT } from "@helpers/jwt/jwt";
import { BadInputError } from "@domain/model/Error/Error";
import { UserRequestDto } from "@domain/model/request";
import LogDomainService from "@domain/service/LogDomainService";

// Assume the 'Client' role has an ID of 3 from your seeder migration
const CLIENT_GROUP_ID = 3;

export default class AuthAppService {
    /**
     * Registers a new user. If the user's group is 'Client', it also creates a client profile in a single transaction.
     */
    static async Register({ group_id = 3, first_name, last_name, email, password }: UserRequestDto.RegisterRequest) {
        await UserSchema.Register.validateAsync({ group_id, first_name, last_name, email, password });

        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        try {
            await UserDomainService.GetEmailExistDomain(email);

            const expiresInHours = process.env.EXPIRES_IN ? parseInt(process.env.EXPIRES_IN) : 1;
            const expiresIn = expiresInHours * 60 * 60; // convert hours to seconds

            const password_hash = await hashPassword(password);
            const userPayload = {
                name: first_name,
                group_id,
                email,
                password_hash,
                email_verification_token: await signJWT({ email }, process.env.JWT_SECRET, { expiresIn }) as string
            };

            const { insertId: newUserId } = await UserDomainService.CreateUserDomain(userPayload, query_runner);

            if (group_id === CLIENT_GROUP_ID) {
                const clientPayload = { user_id: newUserId, first_name, last_name };
                await ClientDomainService.CreateClientDomain(clientPayload, query_runner);
            }

            await query_runner.commitTransaction();

            return { message: "Registration successful. Please check your email to verify your account." };
        } catch (error) {
            await query_runner.rollbackTransaction();
            throw error;
        } finally {
            await query_runner.release();
        }
    }

    /**
     * Logs in a user and returns a session JWT with their permissions.
     */
    static async Login(params: UserParamsDto.LoginParams, logData: LogParamsDto.CreateLogParams) {
        const { email, password } = params;
        await UserSchema.Login.validateAsync({ email, password });


        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        try {

            const existingUser = await UserDomainService.CheckUserExistsDomain(email);

            if (!existingUser) {
                throw new BadInputError("WRONG_USERNAME_OR_PASSWORD");
            }
            if (existingUser.status === 'suspended') {
                throw new BadInputError("Your account is suspended. Please contact support.");
            }
            if (existingUser.status === 'pending_verification') {
                throw new BadInputError("Please verify your email before logging in.");
            }

            const isPasswordValid = await checkPassword(password, existingUser.password_hash);
            if (!isPasswordValid) {
                throw new BadInputError("WRONG_USERNAME_OR_PASSWORD");
            }

            const userDataWithRules = await UserDomainService.GetUserDataByIdDomain(existingUser.id);
            const permissions = userDataWithRules.group_rules ? userDataWithRules.group_rules.split(",").map(Number) : [];

            const userClaims = {
                id: existingUser.id,
                group_id: existingUser.group_id,
                permissions: permissions
            };

            const expiresInHours = process.env.EXPIRES_IN ? parseInt(process.env.EXPIRES_IN) : 1;
            const expiresIn = expiresInHours * 60 * 60; // convert hours to seconds

            const token = await signJWT(userClaims, process.env.JWT_SECRET, { expiresIn });

            const result = {
                token,
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    first_name: existingUser.first_name,
                    last_name: existingUser.last_name,
                    group_id: existingUser.group_id,
                    permissions
                }
            };

            // Set last login to now.
            await UserDomainService.UpdateUserLastLogin(existingUser.id, query_runner);

            await LogDomainService.CreateLogDomain({ ...logData, user_id: result.user.id }, query_runner)

            await query_runner.commitTransaction();

            return result;
        } catch (error) {
            await query_runner.rollbackTransaction();
            throw error;
        } finally {
            await query_runner.release();
        }
    }

    /**
     * Verifies a user's email using the token sent during registration.
     */
    static async VerifyEmail(token: string, logData: LogParamsDto.CreateLogParams) {
        await UserSchema.VerifyEmail.validateAsync(token);

        await verifyJWT(token, process.env.JWT_SECRET);

        const user = await UserDomainService.FindUserByTokenDomain(token);
        if (!user || user.status !== 'pending_verification') {
            throw new BadInputError("Invalid or expired verification link.");
        }

        const query_runner = AppDataSource.createQueryRunner();
        await query_runner.connect();
        await query_runner.startTransaction();

        try {
            await UserDomainService.VerifyEmailDomain(user.email, query_runner);

            await LogDomainService.CreateLogDomain({ ...logData, user_id: user.id }, query_runner);

            await query_runner.commitTransaction();
            return { message: "Email verified successfully. You can now log in." };
        } catch (error) {
            await query_runner.rollbackTransaction();
            throw error;
        } finally {
            await query_runner.release();
        }
    }
}