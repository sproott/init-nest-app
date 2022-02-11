import { ResponseDtoTypeInput, ResponseType } from 'src/common/decorators/api-response-type'

import { ResponseDto } from 'src/common/types/response.dto'

export enum RegisterResponseError {
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
}

export class RegisterResponseData {
  userId: string
}

export type RegisterResponseDto = ResponseDto<RegisterResponseData, RegisterResponseError>

export const registerResponseDtoTypes: ResponseDtoTypeInput = {
  data: ResponseType.object(RegisterResponseData),
  error: ResponseType.enum(RegisterResponseError),
}
