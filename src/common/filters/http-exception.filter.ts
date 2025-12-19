import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'An error occurred';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        errors = responseObj.errors || null;
      } else {
        message = exception.message || 'An error occurred';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      status = HttpStatus.BAD_REQUEST;
    }

    // Format validation errors for better readability
    let formattedErrors: any[] = [];

    if (Array.isArray(errors) && errors.length > 0) {
      formattedErrors = errors.map((error: any) => {
        if (typeof error === 'object' && error.property) {
          const constraints = Object.values(error.constraints || {});
          return {
            field: error.property,
            messages: constraints,
            value: error.value !== undefined ? error.value : null,
          };
        }
        return error;
      });
    } else if (Array.isArray(message)) {
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

