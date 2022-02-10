import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export type JwtPayload = {
  userId: string
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  decodeToken(token: string): string | false {
    try {
      const decoded: JwtPayload = this.jwtService.verify(token)
      return decoded.userId
    } catch (err) {
      return false
    }
  }

  sign(payload: JwtPayload) {
    return this.jwtService.sign(payload)
  }
}
