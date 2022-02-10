import {
  LoginResponseDto,
  LoginResponseError,
} from './dto/login-user-response.dto'
import {
  RegisterResponseDto,
  RegisterResponseError,
} from './dto/register-user-response.dto'

import { CreateResponse } from 'src/common/types/response.dto'
import { CryptService } from 'src/common/service/crypt.service'
import { Injectable } from '@nestjs/common'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(private cryptService: CryptService) {}

  async register(
    registerUserDto: RegisterUserDto
  ): Promise<RegisterResponseDto> {
    const { username, email, password } = registerUserDto
    if (await User.query().findOne('username', username)) {
      return CreateResponse.error(RegisterResponseError.USERNAME_EXISTS)
    }
    if (await User.query().findOne('email', email)) {
      return CreateResponse.error(RegisterResponseError.EMAIL_EXISTS)
    }
    const { id } = await User.query().insert({
      username,
      email,
      password: await this.cryptService.hash(password),
    })
    return CreateResponse.data({ userId: id })
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { username, password } = loginUserDto
    const user = await User.query().findOne('username', username)

    if (!user) {
      return CreateResponse.error(LoginResponseError.WRONG_USERNAME_OR_PASSWORD)
    }
    if (!(await this.cryptService.compare(password, user.password))) {
      return CreateResponse.error(LoginResponseError.WRONG_USERNAME_OR_PASSWORD)
    }
    return CreateResponse.data({ userId: user.id })
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
