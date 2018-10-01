export class InvalidBodyError extends Error {
    constructor(dto: string) {
        super(`Body did not match dto: ${dto}`);
        this.name = InvalidBodyError.name;
    }
}
