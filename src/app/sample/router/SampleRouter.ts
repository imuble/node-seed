import { Context } from 'koa';
import * as Router from 'koa-router';
import { Logger } from '../../../util/Logger';
import { LoggerFactory } from '../../../util/LoggerFactory';
import { SampleService } from '../services/SampleService';

interface Dependencies {
    sampleService: SampleService;
}

export class SampleRouter {
    dependencies: Dependencies;
    logger: Logger;

    constructor(dependencies: Dependencies) {
        this.dependencies = dependencies;
        this.logger = LoggerFactory.buildLogger(SampleRouter.name);
    }

    get = async (ctx: Context) => {
        const samples = await this.dependencies.sampleService.fetchAll();

        ctx.response.status = 200;
        ctx.response.body = JSON.stringify({ samples });
        ctx.response.headers['content-type'] = 'application/json';
    };

    route(parentRouter: Router) {
        const router = new Router();
        router.get('/', this.get);
        parentRouter.use('/sample', router.routes(), router.allowedMethods());
    }
}
