export class InvalidCredentialsError extends Error {
    constructor() {
        super('The credentials does not match any record in the database');
        this.name = InvalidCredentialsError.name;
    }
}
