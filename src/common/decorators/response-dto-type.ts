import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import { ClassConstructor } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'

type PrimitiveType = 'boolean' | 'number' | 'string'

type ResponseDtoInputType = (SchemaObject | ReferenceObject) & {
  refs?: ClassConstructor<unknown>[]
}

export type ApiResponseDtoInput = {
  data: ResponseDtoInputType
  error: ResponseDtoInputType
}

export const ApiResponseType = (schema: ResponseDtoInputType) =>
  applyDecorators(
    ApiResponse({
      schema,
    }),
    ApiExtraModels(...(schema.refs ?? [])),
  )

export const ApiResponseDtoType = ({ data, error }: ApiResponseDtoInput) =>
  applyDecorators(
    ApiResponseType({
      oneOf: [
        {
          type: 'object',
          properties: {
            type: {
              enum: ['data'],
              type: 'string',
            },
            data,
          },
        },
        {
          type: 'object',
          properties: {
            type: {
              enum: ['error'],
              type: 'string',
            },
            error,
          },
        },
      ],
      refs: [...(data.refs ?? []), ...(error.refs ?? [])],
    }),
  )

export class ResponseType {
  static object = <T>(value: ClassConstructor<T>, nullable = false): ResponseDtoInputType => ({
    oneOf: [{ $ref: getSchemaPath(value as any) }],
    nullable,
    refs: [value],
  })

  static enum = (values: Record<string, string>, nullable = false): ResponseDtoInputType => ({
    enum: Object.values(values),
    type: 'string',
    nullable,
  })

  static primitive = (primitiveType: PrimitiveType, nullable = false): ResponseDtoInputType => ({
    type: primitiveType,
    nullable,
  })

  static custom = (
    schema: SchemaObject,
    refs: ClassConstructor<unknown>[],
  ): ResponseDtoInputType => ({
    ...schema,
    refs,
  })

  static boolean = ResponseType.primitive('boolean')
  static number = ResponseType.primitive('number')
  static string = ResponseType.primitive('string')
}
