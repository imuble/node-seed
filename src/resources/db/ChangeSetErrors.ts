export class InvalidChangeSetOrderError extends Error {
    constructor(missingFile: string, index: number) {
        super(
            `A file is missing, or the order of the requested change sets does not match that of the persisted ones. The file ${missingFile} should be index ${index}`
        );
        this.name = 'InvalidChangeSetOrderError';
    }
}
export class InvalidChangeSetHashError extends Error {
    constructor(filename: string) {
        super(
            `The file ${filename} has been changed since it was created. It is dangerous to edit already persisted change sets, and is therefore not allowed.`
        );
        this.name = 'InvalidChangeSetHashError';
    }
}
export class InvalidRequestedChangeSetsLength extends Error {
    constructor(
        requestedChangeSetsLength: number,
        persistedChangeSetsLength: number
    ) {
        super(
            `The requesting changes should always have a length that is equal to, or larger than the persisted change sets. (${requestedChangeSetsLength} > ${persistedChangeSetsLength})`
        );
        this.name = 'InvalidRequestedChangeSetsLength';
    }
}
