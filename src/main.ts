import { Application } from './app/Application';
import { TransactionRepository } from './app/transaction/repositories/TransactionRepository';
import { SemanticVersion } from './util/SemanticVersion';
import { TransactionService } from './app/transaction/services/TransactionService';
import { Pool } from './resources/db/Pool';
import { AuthenticationService } from './app/authentication/services/AuthenticationService';
import { JWT } from './util/JWT';
import { readFileSync } from 'fs';
import { AuthenticationRepository } from './app/authentication/repository/AuthenticationRepository';

function buildSemanticVersion() {
    const packageJson = require('../package.json');
    const version = packageJson.version;

    return new SemanticVersion(version);
}

async function buildSqlPool(): Promise<Pool> {
    return await new Pool().withChangeSet(
        require('./resources/db/change_sets.json').map(
            (filename: string) => `${__dirname}/resources/db/${filename}`
        )
    );
}

function buildAuthenticationService(
    authenticationRepository: AuthenticationRepository
) {
    const privateKey = readFileSync(
        `${process.cwd()}/secret/jwt/jwtRS256.key`
    ).toString();
    const publicKey = readFileSync(
        `${process.cwd()}/secret/jwt/jwtRS256.key.pub`
    ).toString();
    const jwt = new JWT(publicKey, privateKey);
    const authenticationService = new AuthenticationService({
        jwt,
        authenticationRepository,
    });

    return authenticationService;
}

async function main() {
    const sqlPool = await buildSqlPool();
    const transactionRepository = new TransactionRepository(sqlPool);
    const transactionService = new TransactionService({
        transactionRepository,
    });

    const authenticationRepository = new AuthenticationRepository({
        pool: sqlPool,
    });
    const authenticationService = buildAuthenticationService(
        authenticationRepository
    );

    const semanticVersion = buildSemanticVersion();

    const app = new Application({
        sqlPool,
        semanticVersion,
        transactionService,
        authenticationService,
    });
    app.listen(8080);
}

main();
