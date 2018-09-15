import { SampleRepository } from '../repositories/SampleRepository';

export class SampleService {
    repository: SampleRepository;

    constructor(dependencies: { sampleRepository: SampleRepository }) {
        this.repository = dependencies.sampleRepository;
    }

    async fetchAll() {
        return await this.repository.readAll();
    }
}
