import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import { ClassConstructor } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'

type PrimitiveType = 'boolean' | 'number' | 'string'

type ResponseTypeInput = (SchemaObject | ReferenceObject) & {
  refs?: ClassConstructor<unknown>[]
}

export type ResponseDtoTypeInput = {
  data: ResponseTypeInput
  error: ResponseTypeInput
}

export const ApiResponseType = (schema: ResponseTypeInput) =>
  applyDecorators(
    ApiResponse({
      schema,
    }),
    ApiExtraModels(...(schema.refs ?? [])),
  )

export const ApiResponseDtoType = ({ data, error }: ResponseDtoTypeInput) =>
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
  static object = <T>(value: ClassConstructor<T>, nullable = false): ResponseTypeInput => ({
    oneOf: [{ $ref: getSchemaPath(value) }],
    nullable,
    refs: [value],
  })

  static enum = (values: Record<string, string>, nullable = false): ResponseTypeInput => ({
    enum: Object.values(values),
    type: 'string',
    nullable,
  })

  static primitive = (primitiveType: PrimitiveType, nullable = false): ResponseTypeInput => ({
    type: primitiveType,
    nullable,
  })

  static custom = (schema: SchemaObject, refs: ClassConstructor<unknown>[]): ResponseTypeInput => ({
    ...schema,
    refs,
  })

  static boolean = ResponseType.primitive('boolean')
  static number = ResponseType.primitive('number')
  static string = ResponseType.primitive('string')
}
