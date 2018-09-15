import * as Koa from 'koa';
import * as Router from 'koa-router';

import { SampleRouter } from './sample/router/SampleRouter';
import { SemanticVersion } from '../util/SemanticVersion';
import { SampleService } from './sample/services/SampleService';
import { HealthRouter } from './health/HealthRouter';
import { Pool } from '../resources/db/Pool';
import { LoggerFactory } from '../util/LoggerFactory';
import { Logger } from '../util/Logger';

export interface Dependencies {
    sqlPool: Pool;
    semanticVersion: SemanticVersion;
    sampleService: SampleService;
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
        new SampleRouter(this.dependencies).route(router);

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
