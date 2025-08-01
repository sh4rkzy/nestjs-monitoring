import { Response, Request } from 'express'
import { CustomLogger } from '../customs/logger.customs'
import {
    ArgumentsHost,
    BadRequestException,
    ExceptionFilter,
    HttpStatus,
    Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class CustomExceptionFilter implements ExceptionFilter {
    constructor(private logger: CustomLogger) {
        this.logger.setContext(CustomExceptionFilter.name)
    }

    catch(exception: any | unknown, host: ArgumentsHost): Observable<any> | void {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()
        let globalTransactionId = request.headers['globaltransactionid'] as string ?? crypto.randomUUID()
        switch (exception.constructor) {
            case BadRequestException:
                this.logger.error(`BadRequestException: ${exception.message}`, exception.stack, request.url)
                response.status(HttpStatus.BAD_REQUEST).json({
                    error: HttpStatus.BAD_REQUEST,
                    description: exception.message ?? 'Error in request',
                    transaction: {
                        globalTransactionId: globalTransactionId,
                        timestampTransaction: new Date()
                            .toISOString()
                            .replace('T', ' ')
                            .replace('Z', '')
                            .slice(0, 19),
                    }
                })
                break;
            default:
                this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack, request.url)
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: HttpStatus.INTERNAL_SERVER_ERROR,
                    description: exception.message ?? 'Failed internal server error',
                    transaction: {
                        globalTransactionId: globalTransactionId,
                        timestampTransaction: new Date()
                            .toISOString()
                            .replace('T', ' ')
                            .replace('Z', '')
                            .slice(0, 19),
                    }
                })
                break;
        }
    }
}