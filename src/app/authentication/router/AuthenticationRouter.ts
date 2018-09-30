import { Context } from 'koa';
import * as Router from 'koa-router';
import { Logger } from '../../../util/Logger';
import { LoggerFactory } from '../../../util/LoggerFactory';
import { AuthenticationService } from '../services/AuthenticationService';
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError';
import { TokenExpiredError } from 'jsonwebtoken';

interface Dependencies {
    authenticationService: AuthenticationService;
}

export class AuthenticationRouter {
    dependencies: Dependencies;
    logger: Logger;

    constructor(dependencies: Dependencies) {
        this.dependencies = dependencies;
        this.logger = LoggerFactory.buildLogger(AuthenticationRouter.name);
    }

    login = async (ctx: Context, next: Function) => {
        const body = ctx.request.body as any;

        if (!body || !body.username || !body.password) {
            ctx.response.status = 422;
            return next();
        }

        const username = body.username;
        const password = body.password;

        try {
            const tokens = await this.dependencies.authenticationService.login(
                username,
                password
            );
            ctx.response.status = 200;
            ctx.body = tokens;
        } catch (e) {
            switch (e.name) {
                case TokenExpiredError.name:
                    ctx.response.status = 401;
                    return next();
                case InvalidCredentialsError.name:
                    ctx.response.status = 401;
                    return next();
                default:
                    ctx.response.status = 500;
                    this.logger.error(e);
                    return next();
            }
        }
        return next();
    };
    refresh(ctx: Context) {}

    route(parentRouter: Router) {
        const router = new Router();
        router.post('/login', this.login);
        router.post('/refresh', this.refresh);
        parentRouter.use('/auth', router.routes(), router.allowedMethods());
    }
}
