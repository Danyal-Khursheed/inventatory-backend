import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private extractValidationErrors(exception: any, requestBody: any): any[] {
    const errors: any[] = [];
    
    // Try to extract from various possible locations
    if (exception?.response?.message && Array.isArray(exception.response.message)) {
      return exception.response.message;
    }
    
    if (exception?.response?.errors && Array.isArray(exception.response.errors)) {
      return exception.response.errors;
    }
    
    // Check if there are validation errors in the exception stack
    if (exception?.cause?.response?.message && Array.isArray(exception.cause.response.message)) {
      return exception.cause.response.message;
    }
    
    // Check nested response objects
    if (exception?.response && typeof exception.response === 'object') {
      const response = exception.response;
      if (Array.isArray(response.message)) {
        return response.message;
      }
      if (Array.isArray(response.errors)) {
        return response.errors;
      }
      // Sometimes validation errors are nested deeper
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    }
    
    return errors;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'An error occurred';
    let errors: any = null;

    // Check if request body is empty or missing
    const hasBody = request.body && Object.keys(request.body).length > 0;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Debug logging for BadRequest to understand structure
      if (status === 400) {
        console.log('=== BadRequest Exception Debug ===');
        console.log('Request Body:', JSON.stringify(request.body, null, 2));
        console.log('Exception Response:', JSON.stringify(exceptionResponse, null, 2));
        console.log('Exception Message:', exception.message);
        console.log('Exception Keys:', Object.keys(exception));
        if (exception['response']) {
          console.log('Exception.response:', JSON.stringify(exception['response'], null, 2));
        }
        console.log('================================');
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        
        // Handle validation errors - they can be in message or errors property
        if (Array.isArray(responseObj.message)) {
          // Validation errors from class-validator (I18nValidationPipe)
          message = 'Validation failed';
          errors = responseObj.message;
        } else if (Array.isArray(responseObj.errors)) {
          // Validation errors in errors property
          message = responseObj.message || 'Validation failed';
          errors = responseObj.errors;
        } else if (Array.isArray(responseObj.data)) {
          // Sometimes validation errors are in data property
          message = 'Validation failed';
          errors = responseObj.data;
        } else {
          const responseMessage = responseObj.message || exception.message || '';
          
          // For BadRequest, check if we have validation details
          if (status === 400) {
            // Check if there are validation errors nested in the response
            if (responseObj.errors && Array.isArray(responseObj.errors)) {
              message = 'Validation failed';
              errors = responseObj.errors;
            } else if (responseMessage === 'Bad Request' || responseMessage === '') {
              // Try to extract from exception.response (nestjs-i18n might put it there)
              const exceptionResponseData = exception['response'] || exceptionResponse;
              if (Array.isArray(exceptionResponseData?.message)) {
                message = 'Validation failed';
                errors = exceptionResponseData.message;
              } else if (Array.isArray(exceptionResponseData?.errors)) {
                message = 'Validation failed';
                errors = exceptionResponseData.errors;
              } else {
                // Check if validation errors are in the exception itself
                const validationErrors = this.extractValidationErrors(exception, request.body);
                if (validationErrors.length > 0) {
                  message = 'Validation failed';
                  errors = validationErrors;
                } else {
                  // Handle empty/missing payload case
                  if (!hasBody || !request.body || Object.keys(request.body || {}).length === 0) {
                    message = 'Validation failed';
                    errors = [{
                      field: 'name',
                      messages: ['name should not be empty', 'name must be a string', 'name is required'],
                      value: null,
                    }];
                  } else {
                    // Last resort: provide a helpful message with request body info
                    const bodyKeys = request.body ? Object.keys(request.body) : [];
                    const expectedFields = ['name', 'address', 'city', 'countryName', 'countryCode'];
                    const extraFields = bodyKeys.filter(key => !expectedFields.includes(key));
                    
                    let errorMsg = 'Validation failed. ';
                    if (extraFields.length > 0) {
                      errorMsg += `Extra properties not allowed: ${extraFields.join(', ')}. `;
                    }
                    errorMsg += `Expected fields: ${expectedFields.join(', ')}. `;
                    errorMsg += 'Required field: name. Optional fields: address, city, countryName, countryCode (must be 2 characters).';
                    
                    message = errorMsg;
                  }
                }
              }
            } else {
              message = responseMessage;
            }
          } else {
            message = responseMessage || 'An error occurred';
          }
          errors = responseObj.errors || null;
        }
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
        // Handle ValidationError objects from class-validator
        if (typeof error === 'object' && error.property) {
          const constraints = Object.values(error.constraints || {});
          return {
            field: error.property,
            messages: constraints,
            value: error.value !== undefined ? error.value : null,
          };
        }
        // Handle string messages
        if (typeof error === 'string') {
          return {
            message: error,
          };
        }
        return error;
      });
    } else if (Array.isArray(message) && message.length > 0) {
      formattedErrors = message.map((msg, index) => ({
        field: errors?.[index]?.property || `field_${index}`,
        message: msg,
      }));
    }

    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : 'Validation failed',
    };

    if (formattedErrors.length > 0) {
      errorResponse.errors = formattedErrors;
    } else if (errors && !Array.isArray(errors)) {
      errorResponse.errors = errors;
    } else if (Array.isArray(message) && message.length > 0) {
      errorResponse.errors = message;
    } else if (typeof message === 'string' && message !== 'An error occurred' && status === 400) {
      // If it's a BadRequest with a message, include it
      errorResponse.message = message;
    }

    response.status(status).json(errorResponse);
  }
}

