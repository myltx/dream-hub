import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { camelCase, snakeCase } from 'change-case-object';
import { formatTime } from '../utils/index';

@Injectable()
export class CamelToSnakeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // 1. 将请求体中的字段从 camelCase 转为 snake_case
    if (request.body) {
      request.body = this.convertToSnakeCase(request.body);
    }
    if (request.query) {
      request.query = this.convertToSnakeCase(request.query);
    }

    return next.handle().pipe(
      // 2. 将响应数据的字段从 snake_case 转为 camelCase
      map((data) => this.convertToCamelCase(data)),
    );
  }

  private convertToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertToCamelCase(item));
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          camelCase(key),
          this.formatDates(camelCase(key), this.convertToCamelCase(value)),
        ]),
      );
    }
    return obj;
  }
  private convertToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertToSnakeCase(item));
    } else if (obj && typeof obj === 'object') {
      const pagingParams = ['page', 'limit'];
      for (const key in obj) {
        if (pagingParams.includes(key)) {
          obj[key] = parseInt(obj[key]);
        }
      }

      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          snakeCase(key),
          this.formatDates(snakeCase(key), this.convertToSnakeCase(value)),
        ]),
      );
    }
    return obj;
  }

  private formatDates(key: string, value: any): any {
    // 假设日期字段的key包含 'date' 或 'At' 等词
    if (key.includes('date') || key.includes('At')) {
      return formatTime(value);
    }
    return value;
  }
}
