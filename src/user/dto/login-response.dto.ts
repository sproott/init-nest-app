import { ResponseDtoTypeInput, ResponseType } from 'src/common/decorators/api-response-type'

import { ResponseDto } from 'src/common/types/response.dto'

export enum LoginResponseError {
  WRONG_USERNAME_OR_PASSWORD = 'WRONG_USERNAME_OR_PASSWORD',
}

export class LoginResponseData {
  userId: string
}

export type LoginResponseDto = ResponseDto<LoginResponseData, LoginResponseError>

export const loginResponseDtoType: ResponseDtoTypeInput = {
  data: ResponseType.object(LoginResponseData),
  error: ResponseType.enum(LoginResponseError),
}
