import { Dto, toDto } from 'src/common/types/dto'

import { Expose } from 'class-transformer'
import { ResponseDto } from 'src/common/types/response.dto'
import { ResponseType } from 'src/common/decorators/api-response-type'
import { User } from '../entities/user.entity'

export class CurrentUserDto extends Dto {
  @Expose()
  username: string
  @Expose()
  email: string

  static fromUser = toDto<User>()(CurrentUserDto)
}

export enum CurrentUserError {
  NOT_FOUND = 'NOT_FOUND',
}

export type CurrentUserResponseDto = ResponseDto<CurrentUserDto | null, CurrentUserError>

export const currentUserDtoTypes = {
  data: ResponseType.object(CurrentUserDto, true),
  error: ResponseType.enum(CurrentUserError),
}
