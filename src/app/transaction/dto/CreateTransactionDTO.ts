import { InvalidBodyError } from '../../InvalidBodyError';

export class CreateTransactionDTO {
    type: string;
    amount: number;
    transactionDate: Date;
    category: string;

    constructor(body: any) {
        if (
            !body ||
            !body.type ||
            !body.amount ||
            !body.transactionDate ||
            !body.category
        ) {
            throw new InvalidBodyError(CreateTransactionDTO.name);
        }
        this.transactionDate = new Date(body.transactionDate);
        this.type = body.type;
        this.amount = body.amount;
        this.category = body.category;
    }
}
