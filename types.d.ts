declare namespace Express {
  export interface Request {
    userId: string;
  }
}

declare namespace Mongoose {
  export interface ValidateOpts {
    validator?: RegExp | ValidateFn<any> | undefined | { password: string };
  }
}
