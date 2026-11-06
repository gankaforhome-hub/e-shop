// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log('Request...');
//     next();
//   }
// }

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Inject global logger
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    // The built-in global Logger allows you to pass CONTEXT as the second argument!
    this.logger.log(`[Request] ${method} ${originalUrl}`, 'HTTP');

    next();
  }
}

// import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   // Create a logger instance with the "HTTP" context to see where the log is coming from
//   private readonly logger = new Logger('HTTP');

//   use(req: Request, res: Response, next: NextFunction) {
//     // Get the request method (GET, POST...) and URL
//     const { method, originalUrl } = req;

//     // Output the log using the .log() method
//     this.logger.log(`[Request] ${method} ${originalUrl}`);

//     next();
//   }
// }
