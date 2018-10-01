import { Pool } from '../../../resources/db/Pool';

export class Transaction {
    id: number;
    userId: string;
    type: string;
    amount: number;
    transactionDate: Date;
    category: string;

    constructor(
        id: number,
        userId: string,
        type: string,
        amount: number,
        transactionDate: string,
        category: string
    ) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.amount = amount;
        this.transactionDate = new Date(transactionDate);
        this.category = category;
    }

    static fromRaw(raw: any) {
        return new Transaction(
            raw.id,
            raw.user_id,
            raw.type,
            raw.amount,
            raw.transaction_date,
            raw.category
        );
    }
}

export class TransactionRepository {
    pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async create(
        userId: string,
        type: string,
        amount: number,
        transactionDate: Date,
        category: string
    ) {
        const query =
            'INSERT INTO transaction (user_id, type, amount, transaction_date, category) VALUES($1, $2, $3, $4, $5)';
        const client = await this.pool.connect();
        await client.query(query, [
            userId,
            type,
            amount,
            transactionDate,
            category,
        ]);
    }
    async readAll(userId: string): Promise<Transaction[]> {
        const query = 'SELECT * FROM transaction WHERE userId = $1';
        const result = await this.pool.query(query, [userId]);
        const rows: Transaction[] = result.rows;
        return rows.map(row => {
            return Transaction.fromRaw(row);
        });
    }
}
