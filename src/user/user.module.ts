import { AuthModule } from 'src/auth/auth.module'
import { CryptService } from 'src/common/services/crypt.service'
import { LibService } from 'src/common/services/lib.service'
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, CryptService, LibService],
  exports: [UserService],
})
export class UserModule {}
