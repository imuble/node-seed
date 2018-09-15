import { Application } from './app/Application';
import { SampleRepository } from './app/sample/repositories/SampleRepository';
import { SemanticVersion } from './util/SemanticVersion';
import { SampleService } from './app/sample/services/SampleService';
import { Pool } from './resources/db/Pool';

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

async function main() {
    const sqlPool = await buildSqlPool();
    const sampleRepository = new SampleRepository(sqlPool);
    const sampleService = new SampleService({ sampleRepository });

    const semanticVersion = buildSemanticVersion();

    const app = new Application({ sqlPool, semanticVersion, sampleService });
    app.listen(8080);
}

main();
