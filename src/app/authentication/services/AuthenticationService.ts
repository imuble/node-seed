import { JWT } from '../../../util/JWT';
import { AuthenticationRepository } from '../repository/AuthenticationRepository';
import { validatePassword, hashValue } from '../../../util/password-hash';
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError';
import { Context } from 'koa';

interface Token {
    userId: string;
}
interface AuthenticationTokens {
    refreshToken: Token;
    accessToken: Token;
}
interface Dependencies {
    jwt: JWT;
    authenticationRepository: AuthenticationRepository;
}
export class AuthenticationService {
    private dependencies: Dependencies;

    constructor(dependencies: Dependencies) {
        this.dependencies = dependencies;
    }

    async login(
        username: string,
        password: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const user = await this.dependencies.authenticationRepository.readByUsername(
                username
            );
            const isValidPassword = await validatePassword(
                password,
                user.password
            );
            if (!isValidPassword) {
                throw new InvalidCredentialsError();
            }
            const basePayload = { userId: user.id };
            return {
                accessToken: await this.dependencies.jwt.signPayload(
                    { ...basePayload, type: 'access' },
                    10000
                ),
                refreshToken: await this.dependencies.jwt.signPayload(
                    { ...basePayload, type: 'refresh' },
                    1000 * 60 * 60 * 30
                ),
            };
        } catch (e) {
            throw new InvalidCredentialsError();
        }
    }

    async createUserCredentials(username: string, password: string) {
        const hashedPassword = await hashValue(password);
        await this.dependencies.authenticationRepository.create(
            username,
            hashedPassword
        );
    }

    async validateToken(ctx: Context): Promise<Token> {
        const token = ctx.request.get('Authorization');
        return await this.dependencies.jwt.decodeAndVerifyToken(token);
    }
}
