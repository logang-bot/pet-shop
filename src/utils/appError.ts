interface customErrorMessage {
  [error: string]: string;
}

class AppError extends Error {
  status: string;
  isOperational: boolean;
  constructor(message: string | customErrorMessage, public statusCode: number) {
    super(JSON.stringify(message));
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
