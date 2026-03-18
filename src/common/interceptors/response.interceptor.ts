import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decarators/success-message.decarator';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly _refelector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    const message =
      this._refelector.get<string>(
        RESPONSE_MESSAGE_KEY,
        context.getHandler(),
      ) || 'Request Successful';

    return next.handle().pipe(
      map((data: object) => ({
        success: true,
        statusCode: response.statusCode,
        status: response.statusMessage,
        message,
        data,
      })),
    );
  }
}
