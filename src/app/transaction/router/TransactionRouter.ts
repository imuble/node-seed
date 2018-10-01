import { Context } from 'koa';
import * as Router from 'koa-router';
import { Logger } from '../../../util/Logger';
import { LoggerFactory } from '../../../util/LoggerFactory';
import { TransactionService } from '../services/TransactionService';
import { AuthenticationService } from '../../authentication/services/AuthenticationService';
import { CreateTransactionDTO } from '../dto/CreateTransactionDTO';
import { InvalidBodyError } from '../../InvalidBodyError';
import { TokenExpiredError } from 'jsonwebtoken';

interface Dependencies {
    transactionService: TransactionService;
    authenticationService: AuthenticationService;
}

export class TransactionRouter {
    dependencies: Dependencies;
    logger: Logger;

    constructor(dependencies: Dependencies) {
        this.dependencies = dependencies;
        this.logger = LoggerFactory.buildLogger(TransactionRouter.name);
    }

    get = async (ctx: Context, next: Function) => {
        const token = await this.dependencies.authenticationService.validateToken(
            ctx
        );

        const transactions = await this.dependencies.transactionService.fetchAll(
            token.userId
        );

        ctx.response.status = 200;
        ctx.response.body = JSON.stringify({ transactions });
        ctx.response.headers['content-type'] = 'application/json';
    };

    post = async (ctx: Context, next: Function) => {
        try {
            const token = await this.dependencies.authenticationService.validateToken(
                ctx
            );

            const transaction = new CreateTransactionDTO(ctx.request.body);

            await this.dependencies.transactionService.createTransaction(
                token.userId,
                transaction.type,
                transaction.amount,
                transaction.transactionDate,
                transaction.category
            );
            ctx.response.status = 200;
        } catch (e) {
            switch (e.name) {
                case TokenExpiredError.name:
                    ctx.response.status = 401;
                    return next();
                case InvalidBodyError.name:
                    ctx.response.status = 422;
                    return next();
                default:
                    this.logger.error(e);
                    ctx.response.status = 500;
                    return next();
            }
        }
    };

    route(parentRouter: Router) {
        const router = new Router();
        router.get('/', this.get);
        router.post('/', this.post);
        parentRouter.use(
            '/transactions',
            router.routes(),
            router.allowedMethods()
        );
    }
}
