import { APIError } from 'better-auth';

type ApiErrorStatus = NonNullable<ConstructorParameters<typeof APIError>[0]>;

export const throwApiError = (
  status: ApiErrorStatus,
  message: string,
  details?: unknown,
): never => {
  const apiError = new APIError(status);
  apiError.body = {
    success: false,
    message,
    error: {
      code: apiError.statusCode,
      message,
      ...(details === undefined ? {} : { details }),
    },
  };
  throw apiError;
};
