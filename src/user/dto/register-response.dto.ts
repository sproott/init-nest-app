import { ApiResponseDtoInput, ResponseType } from 'src/common/decorators/response-dto-type'

import { ResponseDto } from 'src/common/types/response.dto'

export enum RegisterResponseError {
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
}

export class RegisterResponseData {
  userId: string
}

export type RegisterResponseDto = ResponseDto<RegisterResponseData, RegisterResponseError>

export const registerResponseDtoTypes: ApiResponseDtoInput = {
  data: ResponseType.object(RegisterResponseData),
  error: ResponseType.enum(RegisterResponseError),
}
