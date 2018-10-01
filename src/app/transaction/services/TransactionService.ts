import { TransactionRepository } from '../repositories/TransactionRepository';

export class TransactionService {
    repository: TransactionRepository;

    constructor(dependencies: {
        transactionRepository: TransactionRepository;
    }) {
        this.repository = dependencies.transactionRepository;
    }

    async createTransaction(
        userId: string,
        type: string,
        amount: number,
        transactionDate: Date,
        category: string
    ) {
        await this.repository.create(
            userId,
            type,
            amount,
            transactionDate,
            category
        );
    }

    async fetchAll(withUserId: string) {
        return await this.repository.readAll(withUserId);
    }
}
