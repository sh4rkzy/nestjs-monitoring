import * as crypto from 'node:crypto';

export function generateTransactionId(): string {
    return crypto.randomUUID();
}