import { Dto, transformToDto } from 'src/common/types/dto'

import { Expose } from 'class-transformer'
import { ResponseDto } from 'src/common/types/response.dto'
import { ResponseType } from 'src/common/decorators/api-response-type'
import { User } from '../entities/user.entity'

export class CurrentUserData extends Dto {
  @Expose()
  username: string
  @Expose()
  email: string

  static fromUser(user: User) {
    return transformToDto(CurrentUserData, user)
  }
}

export enum CurrentUserError {
  NOT_FOUND = 'NOT_FOUND',
}

export type CurrentUserResponseDto = ResponseDto<CurrentUserData | null, CurrentUserError>

export const currentUserDtoTypes = {
  data: ResponseType.object(CurrentUserData, true),
  error: ResponseType.enum(CurrentUserError),
}
