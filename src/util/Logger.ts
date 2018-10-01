export class Logger {
    private scope: string;

    constructor(scope: string = 'default') {
        this.scope = scope;
    }

    info(message: string, optionalParams: object = {}) {
        console.log(
            JSON.stringify({
                type: 'info',
                scope: this.scope,
                timestamp: new Date().toISOString(),
                message: message,
                ...optionalParams,
            })
        );
    }
    error(e: Error, optionalParams: object = {}) {
        console.error(
            JSON.stringify({
                type: 'error',
                scope: this.scope,
                timestamp: new Date().toISOString(),
                error: {
                    name: e.name,
                    stack: e.stack,
                    message: e.message,
                },
                ...optionalParams,
            })
        );
    }
}
