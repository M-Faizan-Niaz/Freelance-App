import { APIError } from 'better-auth/api';

export type APIErrorStatus = APIError['status'];

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface MyErrorResponse {
  error: {
    code: number;
    message: string;
    details?: ValidationErrorDetail[];
  };
  message: string;
  success: boolean;
}

export class MyError extends APIError {
  public statusCode: number;
  public details?: ValidationErrorDetail[];

  constructor(
    status: APIErrorStatus,
    statusCode: number,
    message: string,
    details?: ValidationErrorDetail[],
  ) {
    super(status, {
      message,
    });

    this.name = 'MyError';
    this.statusCode = statusCode;
    this.details = details;
  }

  toJSON(): MyErrorResponse {
    return {
      error: {
        code: this.statusCode,
        message: this.message,
        details: this.details,
      },
      message: this.message,
      success: false,
    };
  }
}
