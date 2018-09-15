import { Logger } from './Logger';

export class LoggerFactory {
    static buildLogger(scope: string): Logger {
        return new Logger(scope);
    }
}
