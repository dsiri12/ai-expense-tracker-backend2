export class AppError extends Error {
   constructor(
      public statusCode: number,
      public message: string,
      public code?: string
   ) {
      super(message);

      this.name = this.constructor.name;

      Error.captureStackTrace(this, this.constructor);
   }
}

// export class AppError extends Error {
//    public statusCode: number;
//    public message: string;
//    public code?: string;

//    constructor(statusCode1: number, message1: string, code1?: string) {
//       super(message1);

//       this.statusCode = statusCode1;
//       this.message = message1;
//       this.code = code1;

//       this.name = this.constructor.name;

//       Error.captureStackTrace(this, this.constructor);
//    }
// }
