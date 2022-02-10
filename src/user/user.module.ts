import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CryptService } from 'src/common/service/crypt.service';
import { LibService } from 'src/common/service/lib.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, CryptService, LibService],
  exports: [UserService]
})
export class UserModule { }
