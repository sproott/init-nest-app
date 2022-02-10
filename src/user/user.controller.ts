import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { LibService } from 'src/common/service/lib.service'

import { ApiResponseDto } from 'src/common/decorators/response-dto-type'

import { RegisterResponseDto, registerResponseDtoTypes } from './dto/register-user-response.dto'
import { LoginResponseDto, loginResponseDtoTypes } from './dto/login-user-response.dto'
import {
  CurrentUserData,
  currentUserDtoTypes,
  CurrentUserError,
  CurrentUserResponseDto,
} from './dto/current-user-response.dto'
import { CreateResponse } from 'src/common/types/response.dto'
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
  @ApiResponseDto(registerResponseDtoTypes)
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<RegisterResponseDto> {
    const response = await this.userService.register(registerUserDto)
    if (response.type === 'data') {
      this.setTokenCookie(response.data.userId, res)
    }
    return response
  }

  @Post('login')
  @ApiResponseDto(loginResponseDtoTypes)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<LoginResponseDto> {
    const response = await this.userService.login(loginUserDto)
    if (response.type === 'data') {
      this.setTokenCookie(response.data.userId, res)
    }
    return response
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie('token')
    return true
  }

  @Get('current')
  @ApiResponseDto(currentUserDtoTypes)
  async currentUser(@Req() req: FastifyRequest): Promise<CurrentUserResponseDto> {
    if (req.userId == null) {
      return CreateResponse.data(null)
    }
    const user = await this.userService.findOne(req.userId)
    if (!user) {
      return CreateResponse.error(CurrentUserError.NOT_FOUND)
    }
    return CreateResponse.data(CurrentUserData.fromUser(user))
  }
}
