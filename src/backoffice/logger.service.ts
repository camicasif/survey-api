import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf(({ level, message, timestamp }) => {
                  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
              }),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.DailyRotateFile({
                    filename: 'logs/error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                }),
                new winston.transports.DailyRotateFile({
                    filename: 'logs/combined-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    level: 'info',
                }),
            ],
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    logError(message: string, trace: string) {
        this.logger.error(`${message} - ${trace}`);
    }

    logWarn(message: string) {
        this.logger.warn(message);
    }

    logInfo(message: string) {
        this.logger.info(message);
    }
}
