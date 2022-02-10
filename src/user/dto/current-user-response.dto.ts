import { Dto, transformToDto } from 'src/common/types/dto'

import { CreateResponseType } from 'src/common/decorators/response-dto-type'
import { Expose } from 'class-transformer'
import { ResponseDto } from 'src/common/types/response.dto'
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
  data: CreateResponseType.object(CurrentUserData, true),
  error: CreateResponseType.enum(CurrentUserError),
}
