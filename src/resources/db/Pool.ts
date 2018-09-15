import { readFileSync } from 'fs';
import { createHmac } from 'crypto';
import {
    InvalidRequestedChangeSetsLength,
    InvalidChangeSetOrderError,
    InvalidChangeSetHashError,
} from './ChangeSetErrors';
import { Pool as PgPool } from 'pg';
import { Client } from './PoolClient';

export class Pool {
    private pool: PgPool;

    async withChangeSet(files: string[]) {
        try {
            const resultSet = await this.query(GET_CHANGES_QUERY);
            const persistedChangeSets: ChangeSet[] = resultSet.rows || [];
            const requestChangeSets = files.map(createChangeLogObject);

            if (persistedChangeSets.length > requestChangeSets.length) {
                throw new InvalidRequestedChangeSetsLength(
                    requestChangeSets.length,
                    persistedChangeSets.length
                );
            }

            persistedChangeSets.forEach((changeSet, index) => {
                if (changeSet.filename !== requestChangeSets[index].filename) {
                    throw new InvalidChangeSetOrderError(
                        changeSet.filename,
                        index
                    );
                }
                if (changeSet.hash !== requestChangeSets[index].hash) {
                    throw new InvalidChangeSetHashError(changeSet.filename);
                }
            });

            if (persistedChangeSets.length === requestChangeSets.length) {
                return this;
            }
            // for loop to make it synchronous
            for (let i = persistedChangeSets.length; i < files.length; i++) {
                const file = files[i];
                const fileContent = readFileSync(file).toString();
                const hashValue = hash(fileContent);
                await this.query(fileContent);
                await this.query(
                    'INSERT INTO internal_sql_changes (filename, hash) VALUES($1, $2)',
                    [file, hashValue]
                );
            }
        } catch (e) {
            if (e.code === '42P01') {
                await this.setupChangeSet();
                await this.withChangeSet(files);
            } else {
                throw e;
            }
        }
        return this;
    }

    private async setupChangeSet() {
        await this.query(CREATE_CHANGES_TABLE_QUERY);
    }

    constructor() {
        this.pool = new PgPool();
    }

    async query(query: string, args?: Array<string | number>): Promise<any> {
        return this.pool.query(query, args);
    }

    async connect() {
        const poolClient = await this.pool.connect();
        return new Client(poolClient);
    }
}

const GET_CHANGES_QUERY = 'SELECT * FROM internal_sql_changes';
const CREATE_CHANGES_TABLE_QUERY =
    'CREATE TABLE internal_sql_changes ( id serial, filename text NOT NULL, hash text NOT NULL, change_date TIMESTAMP DEFAULT NOW(), PRIMARY KEY (id) )';

interface ChangeSet {
    hash: string;
    filename: string;
}

function hash(value: string) {
    const hash = createHmac('sha256', 'secret')
        .update(value)
        .digest('hex');
    return hash;
}

function createChangeLogObject(filename: string): ChangeSet {
    const fileValue = readFileSync(filename).toString();
    return {
        hash: hash(fileValue),
        filename: filename,
    };
}
