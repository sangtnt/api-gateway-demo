export const enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn',
}

export const ErrorCodes = {
  BAD_REQ: {
    code: 'AUTH-BE-BAD_REQ',
    message: 'Bad request',
    logLevel: LogLevel.ERROR,
  },

  TIME_OUT: {
    code: 'AUTH-BE-TIME_OUT',
    message: 'Time out',
    logLevel: LogLevel.ERROR,
  },

  TOKEN_EXPIRED: {
    code: 'AUTH-BE-TOKEN_EXPIRED',
    message: 'Token expired',
    logLevel: LogLevel.ERROR,
  },

  DATA_NOT_FOUND: {
    code: 'AUTH-BE-DATA_NOT_FOUND',
    message: 'Data not found',
    logLevel: LogLevel.ERROR,
  },

  INVALID_VERIFICATION_CODE: {
    code: 'AUTH-BE-INVALID_VERIFICATION_CODE',
    message: 'Invalid verification code',
    logLevel: LogLevel.ERROR,
  },

  DATA_EXISTS: {
    code: 'AUTH-BE-DATA_EXIST',
    message: 'Data already exists',
    logLevel: LogLevel.ERROR,
  },

  INTERNAL_SERVER_ERROR: {
    code: 'AUTH-BE-INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    logLevel: LogLevel.ERROR,
  },

  UNAUTHENTICATED: {
    code: 'AUTH-BE-UNAUTHENTICATED',
    message: 'unauthenticated',
    logLevel: LogLevel.ERROR,
  },
};
