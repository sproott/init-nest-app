import { ClassConstructor, Exclude, plainToClass } from 'class-transformer'

export class Dto {
  @Exclude()
  _isDto: true
}

export const transformToDto = <T>(entityClass: ClassConstructor<T>, entity: unknown) =>
  plainToClass(entityClass, entity, { excludeExtraneousValues: true })
