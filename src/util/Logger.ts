export class Logger {
    private scope: string;

    constructor(scope: string = 'default') {
        this.scope = scope;
    }

    info(message: string) {
        console.log(
            JSON.stringify({
                scope: this.scope,
                timestamp: new Date().toISOString(),
                message: message,
            })
        );
    }
    error(e: Error) {
        console.error(
            JSON.stringify({
                scope: this.scope,
                timestamp: new Date().toISOString(),
                error: e,
            })
        );
    }
}
