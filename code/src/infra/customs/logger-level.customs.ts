import { LogLevel } from '@nestjs/common';

const rawLogLevel = process.env.LOG_LEVEL ?? '';
const parsedLogLevel = rawLogLevel
  .split(',')
  .map(level => level.trim())
  .filter(level => level) as LogLevel[];

const defaultLogLevel: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

export const loggerConfig = {
  level: parsedLogLevel.length > 0 ? parsedLogLevel : defaultLogLevel,
};
