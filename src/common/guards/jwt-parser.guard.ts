import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtParserGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    const res: FastifyReply = context.switchToHttp().getResponse()

    const cookie: string | undefined = req.cookies.token
    if (cookie !== undefined) {
      const token = cookie.split(' ')[1]
      const userId = this.authService.decodeToken(token)
      if (!userId) {
        res.clearCookie('token')
        throw new HttpException('Failed to decode token', HttpStatus.BAD_REQUEST)
      }
      if (!(await this.userService.findOne(userId))) {
        res.clearCookie('token')
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND)
      }
      req.userId = userId
    }

    return true
  }
}
