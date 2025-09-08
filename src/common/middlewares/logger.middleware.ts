import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, params } = req;
    const time = Date.now();

    this.logger.log(
      `Request -> ${method} ${originalUrl} | Params: ${JSON.stringify(params)} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(req.body)}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - time;
      this.logger.log(
        `Response -> ${method} ${originalUrl} | Status: ${statusCode} | Content-Length: ${contentLength ?? 0} | Duration: ${duration}ms`,
      );
    });
    next();
  }
}
