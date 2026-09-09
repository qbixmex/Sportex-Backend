import { Response } from 'express';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SKIP_TRANSFORM_KEY } from '../modules/common/decorators/skip-transform.decorator.js';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode ?? 200;

    const skip =
      Reflect.getMetadata(SKIP_TRANSFORM_KEY, context.getHandler()) ??
      Reflect.getMetadata(SKIP_TRANSFORM_KEY, context.getClass());

    if (skip) {
      return next.handle();
    }
  
    return next.handle().pipe(
      map((data: T) => ({
        statusCode,
        message: 'Success',
        ...data,
      }))
    );
  }
}
