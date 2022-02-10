import {
  ApiResponseDtoInput,
  CreateResponseType,
} from 'src/common/decorators/response-dto-type'

import { ResponseDto } from 'src/common/types/response.dto'

export enum LoginResponseError {
  WRONG_USERNAME_OR_PASSWORD = 'WRONG_USERNAME_OR_PASSWORD',
}

export class LoginResponseData {
  userId: string
}

export type LoginResponseDto = ResponseDto<
  LoginResponseData,
  LoginResponseError
>

export const loginResponseDtoTypes: ApiResponseDtoInput = {
  data: CreateResponseType.object(LoginResponseData),
  error: CreateResponseType.enum(LoginResponseError),
}
