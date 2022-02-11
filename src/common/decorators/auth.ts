import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { UseGuards, applyDecorators } from '@nestjs/common'

import { AuthGuard } from '../guards/auth.guard'

export const Auth = () =>
  applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  )
