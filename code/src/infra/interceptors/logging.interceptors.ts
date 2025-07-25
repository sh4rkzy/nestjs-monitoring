import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const uuid = randomUUID();
    request.localTransactionId = uuid;

    const globalTransactionId = request.headers['globaltransactionid'];
    request.globalTransactionId = globalTransactionId;

    const metodo = `${context.getClass().name}.${context.getHandler().name}`;
    this.logger.log(`${globalTransactionId
      ? `[GlobalTransactionID - ${globalTransactionId}] `
      : ''} Executando método. ${metodo}`);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${globalTransactionId
              ? `[GlobalTransactionID - ${globalTransactionId}] `
              : ''} Método executado em ${Date.now() - now} ms. ${metodo}`
          ),
        ),
      );
  }
}
