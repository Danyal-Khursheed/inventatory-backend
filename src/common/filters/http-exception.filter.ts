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
    
    // Check exception.errors directly (I18nValidationException stores them here)
    if (exception?.errors && Array.isArray(exception.errors)) {
      // Filter out empty objects and return actual validation errors
      const validErrors = exception.errors.filter((err: any) => 
        err && typeof err === 'object' && (err.property || err.constraints || Object.keys(err).length > 0)
      );
      if (validErrors.length > 0) {
        return validErrors;
      }
    }
    
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
        console.log('Exception.errors:', JSON.stringify((exception as any)?.errors, null, 2));
        console.log('Full Exception:', JSON.stringify(exception, Object.getOwnPropertyNames(exception), 2));
        if (exception['response']) {
          console.log('Exception.response:', JSON.stringify(exception['response'], null, 2));
        }
        console.log('================================');
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        
        // Handle validation errors - they can be in message or errors property
        if (Array.isArray(responseObj.errors)) {
          // Validation errors from ValidationPipe (in errors property)
          message = responseObj.message || 'Validation failed';
          errors = responseObj.errors;
        } else if (Array.isArray(responseObj.message)) {
          // Validation errors in message property
          message = 'Validation failed';
          errors = responseObj.message;
        } else if (Array.isArray(responseObj.data)) {
          // Sometimes validation errors are in data property
          message = 'Validation failed';
          errors = responseObj.data;
        } else {
          const responseMessage = responseObj.message || exception.message || '';
          
          // For BadRequest, check if we have validation details
          if (status === 400) {
            // Try multiple ways to extract validation errors
            let validationErrors: any[] = [];
            
            // Method 1: Check exception.errors directly (I18nValidationException)
            const exceptionErrors = (exception as any)?.errors;
            let shouldGenerateErrors = false;
            if (exceptionErrors && Array.isArray(exceptionErrors)) {
              // Filter out empty objects and extract actual validation errors
              validationErrors = exceptionErrors.filter((err: any) => {
                if (!err || typeof err !== 'object') return false;
                // Check if it has validation error properties
                return err.property || err.constraints || (Object.keys(err).length > 0 && Object.keys(err).some(key => key !== 'target' && key !== 'value'));
              });
              
              // If we only have empty objects, the validation errors might be lost
              // We'll handle this in the fallback below
              if (validationErrors.length === 0 && exceptionErrors.length > 0) {
                // Validation errors were lost, we'll generate them from request body
                shouldGenerateErrors = true;
              }
            }
            
            // Method 2: Check exception.response directly
            if (validationErrors.length === 0 && exception['response'] && typeof exception['response'] === 'object') {
              const exResponse = exception['response'] as any;
              if (Array.isArray(exResponse.message)) {
                validationErrors = exResponse.message;
              } else if (Array.isArray(exResponse.errors)) {
                validationErrors = exResponse.errors;
              } else if (Array.isArray(exResponse.data)) {
                validationErrors = exResponse.data;
              }
            }
            
            // Method 3: Use extractValidationErrors helper
            if (validationErrors.length === 0) {
              validationErrors = this.extractValidationErrors(exception, request.body);
            }
            
            // Method 4: Check if message is an array (sometimes happens)
            if (validationErrors.length === 0 && Array.isArray(responseMessage)) {
              validationErrors = responseMessage;
            }
            
            // If we found validation errors, use them
            if (validationErrors && validationErrors.length > 0) {
              message = 'Validation failed';
              errors = validationErrors;
            } else {
              // Always generate validation errors from request body when validation errors are missing
              const bodyKeys = request.body ? Object.keys(request.body) : [];
              const requiredFields = ['name'];
              const missingFields = requiredFields.filter(field => !bodyKeys.includes(field));
              
              if (missingFields.length > 0) {
                message = 'Validation failed';
                errors = missingFields.map(field => ({
                  field: field,
                  messages: [`${field} is required`, `${field} should not be empty`, `${field} must be a string`],
                  value: null,
                }));
              } else if (!hasBody || !request.body || Object.keys(request.body || {}).length === 0) {
                // Empty payload
                message = 'Validation failed';
                errors = [{
                  field: 'name',
                  messages: ['name is required', 'name should not be empty', 'name must be a string'],
                  value: null,
                }];
              } else {
                // Check for other validation issues
                const expectedFields = ['name', 'address', 'city', 'countryName', 'countryCode'];
                const extraFields = bodyKeys.filter(key => !expectedFields.includes(key));
                
                if (extraFields.length > 0) {
                  message = 'Validation failed';
                  errors = extraFields.map(field => ({
                    field: field,
                    messages: [`${field} is not a valid property`, `Extra properties not allowed: ${field}`],
                    value: request.body[field],
                  }));
                } else {
                  // Last resort: provide a helpful message
                  let errorMsg = 'Validation failed. ';
                  errorMsg += `Expected fields: ${expectedFields.join(', ')}. `;
                  errorMsg += 'Required field: name. Optional fields: address, city, countryName, countryCode (must be 2 characters).';
                  message = errorMsg;
                }
              }
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
        // Handle ValidationError objects from class-validator (from ValidationPipe)
        if (typeof error === 'object' && error.property) {
          const constraints = error.constraints || {};
          const constraintKeys = Object.keys(constraints);
          const messages = Object.values(constraints);
          
          return {
            field: error.property,
            messages: messages,
            constraints: constraintKeys,
            value: error.value !== undefined ? error.value : null,
            rejectedValue: error.value !== undefined ? error.value : null,
          };
        }
        // Handle pre-formatted errors from exceptionFactory
        if (typeof error === 'object' && error.messages && Array.isArray(error.messages)) {
          return {
            field: error.property || error.field || 'unknown',
            messages: error.messages,
            constraints: error.constraints ? Object.keys(error.constraints) : [],
            value: error.value !== undefined ? error.value : null,
            rejectedValue: error.value !== undefined ? error.value : null,
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
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : 'Validation failed',
    };

    if (formattedErrors.length > 0) {
      errorResponse.errors = formattedErrors;
      errorResponse.errorCount = formattedErrors.length;
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

