import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];
    let errors: any = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || exception.message;
      errors = responseObj.errors || null;
    } else {
      message = exception.message || 'An error occurred';
    }

    // Format validation errors for better readability
    let formattedErrors: any[] = [];

    if (Array.isArray(errors) && errors.length > 0) {
      // If errors array contains validation error objects
      formattedErrors = errors.map((error: any) => {
        if (typeof error === 'object' && error.property) {
          const constraints = Object.values(error.constraints || {});
          return {
            field: error.property,
            messages: constraints,
            value: error.value,
          };
        }
        return error;
      });
    } else if (Array.isArray(message)) {
      // If message is an array of error messages
      formattedErrors = message.map((msg, index) => ({
        field: errors?.[index]?.property || `field_${index}`,
        message: msg,
      }));
    }

    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message)
        ? 'Validation failed'
        : (message as string),
    };

    if (formattedErrors.length > 0) {
      errorResponse.errors = formattedErrors;
    } else if (errors) {
      errorResponse.errors = errors;
    } else if (Array.isArray(message) && message.length > 0) {
      errorResponse.errors = message;
    }

    response.status(status).json(errorResponse);
  }
}

