import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { keysSnakeToCamel } from '../utils/snake-to-camel';

/**
 * Transforms request body (and nested objects/arrays) from snake_case keys to camelCase.
 * Register as the first global pipe so ValidationPipe receives camelCase and
 * forbidNonWhitelisted doesn't reject snake_case keys.
 */
@Injectable()
export class SnakeToCamelBodyPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body' || value == null) {
      return value;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      return keysSnakeToCamel(value);
    }
    return value;
  }
}
