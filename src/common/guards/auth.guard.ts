import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'

import { FastifyRequest } from 'fastify'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    if (req.userId == null) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED)
    }

    return true
  }
}
