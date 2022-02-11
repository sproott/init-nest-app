import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthService } from 'src/auth/auth.service'
import { LibService } from 'src/common/services/lib.service'

import {
  ApiResponseDtoType,
  ApiResponseType,
  ResponseType,
} from 'src/common/decorators/api-response-type'

import { RegisterResponseDto, registerResponseDtoTypes } from './dto/register-response.dto'
import { LoginResponseDto, loginResponseDtoType } from './dto/login-response.dto'
import {
  CurrentUserData,
  currentUserDtoTypes,
  CurrentUserError,
  CurrentUserResponseDto,
} from './dto/current-user-response.dto'
import { Response } from 'src/common/types/response.dto'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly libService: LibService,
  ) {}

  private setTokenCookie(userId: string, res: FastifyReply) {
    res.setCookie('token', `Bearer ${this.authService.sign({ userId })}`, {
      httpOnly: true,
      secure: this.libService.isProduction(),
      sameSite: this.libService.isProduction() ? 'none' : undefined,
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      path: '/',
    })
  }

  @Post('register')
  @ApiResponseDtoType(registerResponseDtoTypes)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<RegisterResponseDto> {
    const response = await this.userService.register(registerDto)
    if (response.type === 'data') {
      this.setTokenCookie(response.data.userId, res)
    }
    return response
  }

  @Post('login')
  @ApiResponseDtoType(loginResponseDtoType)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<LoginResponseDto> {
    const response = await this.userService.login(loginDto)
    if (response.type === 'data') {
      this.setTokenCookie(response.data.userId, res)
    }
    return response
  }

  @Post('logout')
  @ApiResponseType(ResponseType.boolean)
  logout(@Res({ passthrough: true }) res: FastifyReply): boolean {
    res.clearCookie('token')
    return true
  }

  @Get('current')
  @ApiResponseDtoType(currentUserDtoTypes)
  async currentUser(@Req() req: FastifyRequest): Promise<CurrentUserResponseDto> {
    if (req.userId == null) {
      return Response.data(null)
    }
    const user = await this.userService.findOne(req.userId)
    if (!user) {
      return Response.error(CurrentUserError.NOT_FOUND)
    }
    return Response.data(CurrentUserData.fromUser(user))
  }
}
