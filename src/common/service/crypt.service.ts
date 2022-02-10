import * as bcrypt from 'bcrypt'

import { Injectable } from '@nestjs/common'

@Injectable()
export class CryptService {
  hash(str: string, saltRounds = 12) {
    return bcrypt.hash(str, saltRounds)
  }

  compare(str: string, hash: string) {
    return bcrypt.compare(str, hash)
  }
}
