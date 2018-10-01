import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

import { TransactionRouter } from './transaction/router/TransactionRouter';
import { SemanticVersion } from '../util/SemanticVersion';
import { TransactionService } from './transaction/services/TransactionService';
import { HealthRouter } from './health/HealthRouter';
import { Pool } from '../resources/db/Pool';
import { LoggerFactory } from '../util/LoggerFactory';
import { Logger } from '../util/Logger';
import { AuthenticationService } from './authentication/services/AuthenticationService';
import { AuthenticationRouter } from './authentication/router/AuthenticationRouter';

export interface Dependencies {
    sqlPool: Pool;
    semanticVersion: SemanticVersion;
    transactionService: TransactionService;
    authenticationService: AuthenticationService;
}

export class Application {
    koa: Koa;
    dependencies: Dependencies;

    logger: Logger;

    constructor(dependencies: Dependencies) {
        this.koa = new Koa();
        this.dependencies = dependencies;
        this.logger = LoggerFactory.buildLogger(Application.name);
        this.routes();
    }

    routes() {
        const healthRoutes = new HealthRouter(this.dependencies).getRoutes();

        const router = new Router({
            prefix: `/v${this.dependencies.semanticVersion.getMajor()}`,
        });
        new TransactionRouter(this.dependencies).route(router);
        new AuthenticationRouter(this.dependencies).route(router);

        this.koa.use(async (ctx: Koa.Context, next) => {
            const start = new Date();
            await next();
            const end = new Date();
            this.logger.info(
                `${ctx.request.path} finished with status code ${
                    ctx.response.status
                } in ${end.getTime() - start.getTime()}ms`
            );
        });
        this.koa.use(bodyParser());
        this.koa.use(healthRoutes);
        this.koa.use(router.routes());
        this.koa.use(router.allowedMethods());
    }

    listen(port: number) {
        this.koa.listen(port, () => {
            this.logger.info(`Server is listening on port ${port}`);
        });
    }
}
