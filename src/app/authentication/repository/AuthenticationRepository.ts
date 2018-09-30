import { v4 as uuid } from 'uuid';
import { Pool } from '../../../resources/db/Pool';

export class UserCredentials {
    id: string;
    username: string;
    password: string;

    constructor(id: string, username: string, password: string) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static fromRaw(raw: any): UserCredentials {
        return new UserCredentials(raw.id, raw.username, raw.password);
    }
}

interface Dependencies {
    pool: Pool;
}
export class AuthenticationRepository {
    dependencies: Dependencies;

    constructor(dependencies: Dependencies) {
        this.dependencies = dependencies;
    }

    async create(username: string, password: string) {
        const id = uuid();
        const user = await this.dependencies.pool.query(
            'INSERT INTO user_credentials (id, username, password) VALUES($1, $2, $3)',
            [id, username, password]
        );
    }
    async read(id: string): Promise<UserCredentials> {
        const result = await this.dependencies.pool.query(
            'SELECT * FROM user_credentials WHERE id = $1',
            [id]
        );
        return UserCredentials.fromRaw(result);
    }
    async readByUsername(username: string): Promise<UserCredentials> {
        const result = await this.dependencies.pool.query(
            'SELECT * FROM user_credentials WHERE username = $1',
            [username]
        );
        return UserCredentials.fromRaw(result.rows[0]);
    }
}
