import { ClassConstructor, Exclude, plainToClass } from 'class-transformer'

export class Dto {
  @Exclude()
  $isDto: true
}

export const toDto =
  <TEntity>() =>
  <TDto>(dtoClass: ClassConstructor<TDto>) =>
  (entity: TEntity) =>
    plainToClass(dtoClass, entity, { excludeExtraneousValues: true })
