import { Context } from 'koa';
import * as Router from 'koa-router';

import { Pool } from '../../resources/db/Pool';

interface ServiceState {
    code: number;
}
interface ServiceDependencies {
    required: { [key: string]: ServiceState };
    optional: {};
}

interface Dependencies {
    sqlPool: Pool;
}
export class HealthRouter {
    dependencies: Dependencies;

    constructor(dependencies: Dependencies) {
        this.dependencies = dependencies;
    }

    get = async (ctx: Context) => {
        const serviceDependencies: ServiceDependencies = {
            required: {},
            optional: {},
        };
        try {
            const client = await this.dependencies.sqlPool.connect();
            serviceDependencies.required['db'] = {
                code: 200,
            };
            client.release();
        } catch (e) {
            serviceDependencies.required['db'] = {
                code: -1,
            };
        }

        ctx.response.status = Object.keys(serviceDependencies.required).every(
            key => serviceDependencies.required[key].code === 200
        )
            ? 200
            : 503;
        ctx.response.body = JSON.stringify({
            dependencies: serviceDependencies,
        });
        ctx.response.headers['content-type'] = 'application/json';
    };

    getRoutes() {
        const router = new Router();
        router.get('/healthz', this.get);
        return router.routes();
    }
}
