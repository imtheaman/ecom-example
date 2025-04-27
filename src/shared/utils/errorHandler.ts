import axios, { AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Types
interface HttpData {
  code: string;
  description?: string;
  status: number;
}

type THttpError = Error | AxiosError | null;

interface ErrorHandlerObject {
  after?(error?: THttpError, options?: ErrorHandlerObject): void;
  before?(error?: THttpError, options?: ErrorHandlerObject): void;
  message?: string;
  errorType?: string;
}

type ErrorHandlerFunction = (error?: THttpError) => ErrorHandlerObject | boolean | undefined;

type ErrorHandler = ErrorHandlerFunction | ErrorHandlerObject | string;

interface ErrorHandlerMany {
  [key: string]: ErrorHandler;
}

function isErrorHandlerObject(value: any): value is ErrorHandlerObject {
  if (typeof value === 'object') {
    return ['message', 'after', 'before', 'errorType'].some((k) => k in value);
  }
  return false;
}

export class ErrorHandlerRegistry {
  private handlers = new Map<string, ErrorHandler>();
  private parent: ErrorHandlerRegistry | null = null;

  constructor(parent?: ErrorHandlerRegistry, input?: ErrorHandlerMany) {
    if (typeof parent !== 'undefined') this.parent = parent;
    if (typeof input !== 'undefined') this.registerMany(input);
  }

  register(key: string, handler: ErrorHandler) {
    this.handlers.set(key, handler);
    return this;
  }

  unregister(key: string) {
    this.handlers.delete(key);
    return this;
  }

  find(seek: string): ErrorHandler | undefined {
    const handler = this.handlers.get(seek);
    if (handler) return handler;
    return this.parent?.find(seek);
  }

  registerMany(input: ErrorHandlerMany) {
    for (const [key, value] of Object.entries(input)) {
      this.register(key, value);
    }
    return this;
  }

  handleError(
    seek: (string | undefined)[] | string,
    error: THttpError
  ): boolean {
    if (Array.isArray(seek)) {
      return seek.some((key) => {
        if (key !== undefined) return this.handleError(String(key), error);
        return false;
      });
    }
    
    const handler = this.find(String(seek));
    
    if (!handler) {
      return false;
    } else if (typeof handler === 'string') {
			// @ts-ignore
      return this.handleErrorObject(error, { message: handler });
    } else if (typeof handler === 'function') {
      const result = handler(error);
			// @ts-ignore
      if (isErrorHandlerObject(result)) return this.handleErrorObject(error, result);
      return !!result;
    } else if (isErrorHandlerObject(handler)) {
			// @ts-ignore
      return this.handleErrorObject(error, handler);
    }
    
    return false;
  }

  handleErrorObject(error: THttpError, options: ErrorHandlerObject = {}) {
    options?.before?.(error, options);
    
    const statusCode = this.extractStatusCode(error);
    const errorCode = this.extractErrorCode(error);
    
    const apiError = new ApiError(
      options.message ?? 'Unknown Error', 
      statusCode,
      errorCode,
      error instanceof Error ? error : undefined
    );
    
    if (options.errorType) {
      (apiError as any).errorType = options.errorType;
    }
    
    if (options.after) {
      setTimeout(() => options.after?.(error, options), 0);
    }
    
    throw apiError;
  }

  private extractStatusCode(error: THttpError): number | undefined {
    if (!error) return undefined;
    
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    
    return undefined;
  }

  private extractErrorCode(error: THttpError): string | undefined {
    if (!error) return undefined;
    
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as HttpData;
      return data?.code || error.code;
    }
    
    return undefined;
  }

  responseErrorHandler(error: THttpError, direct?: boolean) {
    if (error === null) throw new Error('Unrecoverable error!! Error is null!');
    
    if (axios.isAxiosError(error)) {
      const response = error?.response;
      const config = error?.config;
      const data = response?.data as HttpData;
      
      if (!direct && config && 'raw' in config && config.raw) throw error;
      
      const seekers = [
        data?.code,
        error.code,
        error?.name,
        String(data?.status),
        String(response?.status),
      ];
      
      const result = this.handleError(seekers, error);
      
      if (!result) {
        if (data?.code && data?.description) {
          return this.handleErrorObject(error, {
            message: data?.description,
          });
        }

        const statusCode = response?.status;
        const message = 
          data?.description || 
          error.message || 
          `Error ${statusCode || 'unknown'}`;
        
        throw new ApiError(message, statusCode, data?.code, error);
      }
    } else if (error instanceof Error) {
      return this.handleError(error.name, error);
    }
    
    throw error;
  }
}

export const globalHandlers = new ErrorHandlerRegistry();

export function dealWith(solutions: ErrorHandlerMany, ignoreGlobal?: boolean) {
  let global;
  if (ignoreGlobal !== true) global = globalHandlers;
  const localHandlers = new ErrorHandlerRegistry(global, solutions);
  return (error: any) => localHandlers.responseErrorHandler(error, true);
}

globalHandlers.registerMany({
  '400': {
    message: 'Bad request. Please check your input.',
    errorType: 'BAD_REQUEST'
  },
  '401': {
    message: 'Authentication required. Please log in again.',
    errorType: 'UNAUTHORIZED',
    after: () => {
      console.log('User should be redirected to login');
    }
  },
  '403': {
    message: 'Access forbidden. You don\'t have permission.',
    errorType: 'FORBIDDEN'
  },
  '404': {
    message: 'Resource not found.',
    errorType: 'NOT_FOUND'
  },
  '500': {
    message: 'Server error. Please try again later.',
    errorType: 'SERVER_ERROR'
  },
  'ERR_NETWORK': {
    message: 'Network error. Please check your connection.',
    errorType: 'NETWORK_ERROR'
  },
  'ERR_TIMEOUT': {
    message: 'Request timeout. Please try again.',
    errorType: 'TIMEOUT'
  },
});
