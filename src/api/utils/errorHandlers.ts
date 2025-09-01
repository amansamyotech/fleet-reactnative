interface ApiError {
    status: number;
    message: string;
    errors?: any;
    originalError: any;
  }
  
  export const handleApiError = (error: any): ApiError => {
    if (!error.response) {
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        originalError: error,
      };
    }
  
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          status,
          message: data.message || 'Invalid request',
          errors: data.errors,
          originalError: error,
        };
      case 401:
        return {
          status,
          message: 'Authentication required',
          originalError: error,
        };
      case 403:
        return {
          status,
          message: 'You don\'t have permission to access this resource',
          originalError: error,
        };
      case 404:
        return {
          status,
          message: 'Resource not found',
          originalError: error,
        };
      case 422:
        return {
          status,
          message: 'Validation error',
          errors: data.errors,
          originalError: error,
        };
      case 429:
        return {
          status,
          message: 'Too many requests. Please try again later.',
          originalError: error,
        };
      case 500:
      case 502:
      case 503:
        return {
          status,
          message: 'Server error. Please try again later.',
          originalError: error,
        };
      default:
        return {
          status,
          message: data?.message || 'An unexpected error occurred',
          originalError: error,
        };
    }
  };