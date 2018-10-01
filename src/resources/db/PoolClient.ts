import { Pool as PgPool, PoolClient } from 'pg';

export class Client {
    private client: PoolClient;

    constructor(client: PoolClient) {
        this.client = client;
    }

    release() {
        this.client.release();
    }

    async query(
        query: string,
        args?: Array<any>,
        release: boolean = false
    ): Promise<any> {
        try {
            const result = await this.client.query(query, args);
            if (release) this.release();
            return result.rows;
        } catch (e) {
            this.release();
            throw e;
        }
    }
}
