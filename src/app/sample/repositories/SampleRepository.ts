import { Pool } from '../../../resources/db/Pool';

export class Sample {
    id: number;
    sampleData: string;

    constructor(id: number, sampleData: string) {
        this.id = id;
        this.sampleData = sampleData;
    }

    static fromRaw(raw: any) {
        if (!raw) return null;
        return new Sample(raw.id, raw.sampledata);
    }
}

export class SampleRepository {
    pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async create(sampledata: string) {
        const query = 'INSERT INTO sample (sampledata) VALUES($1)';
        const client = await this.pool.connect();
        await client.query(query, [sampledata]);
    }
    async read(id: number): Promise<Sample | null> {
        const query = 'SELECT * FROM sample WHERE id = $1';
        const result = await this.pool.query(query, [id]);
        return Sample.fromRaw(result[0]);
    }
    async readAll(): Promise<Sample[]> {
        const query = 'SELECT * FROM sample';
        const result = await this.pool.query(query);
        return result.map(Sample.fromRaw);
    }
}
