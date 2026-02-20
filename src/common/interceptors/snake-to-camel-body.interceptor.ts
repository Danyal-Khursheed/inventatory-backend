import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { keysSnakeToCamel } from '../utils/snake-to-camel';

/**
 * Converts request body keys from snake_case to camelCase so DTOs
 * receive camelCase properties (e.g. price_per_item → pricePerItem).
 */
@Injectable()
export class SnakeToCamelBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.body && typeof request.body === 'object' && !Array.isArray(request.body)) {
      request.body = keysSnakeToCamel(request.body) as Request['body'];
    }
    return next.handle();
  }
}
