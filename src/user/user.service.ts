import { LoginResponseDto, LoginResponseError } from './dto/login-response.dto'
import { RegisterResponseDto, RegisterResponseError } from './dto/register-response.dto'

import { CryptService } from 'src/common/services/crypt.service'
import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { Response } from 'src/common/types/response.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(private cryptService: CryptService) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { username, email, password } = registerDto
    if (await User.query().findOne('username', username)) {
      return Response.error(RegisterResponseError.USERNAME_EXISTS)
    }
    if (await User.query().findOne('email', email)) {
      return Response.error(RegisterResponseError.EMAIL_EXISTS)
    }
    const { id } = await User.query().insert({
      username,
      email,
      password: await this.cryptService.hash(password),
    })
    return Response.data({ userId: id })
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto
    const user = await User.query().findOne('username', username)

    if (!user) {
      return Response.error(LoginResponseError.WRONG_USERNAME_OR_PASSWORD)
    }
    if (!(await this.cryptService.compare(password, user.password))) {
      return Response.error(LoginResponseError.WRONG_USERNAME_OR_PASSWORD)
    }
    return Response.data({ userId: user.id })
  }

  async findOne(id: string) {
    const user = await User.query().findById(id)
    if (user !== undefined) {
      return user
    } else {
      return false
    }
  }
}
