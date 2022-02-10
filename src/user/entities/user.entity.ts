import { Model, RelationMappings } from 'objection'

export class User extends Model {
  static get tableName() {
    return 'app_user'
  }

  id: string
  username: string
  email: string

  password: string

  static get relationMappings(): RelationMappings {
    return {}
  }
}
