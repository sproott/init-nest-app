import { Knex } from "knex";
import { uuid } from '../lib'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists "uuid-ossp"')
  return knex.schema.createTable("app_user", (table) => {
    uuid(table, knex)
    table.string("username").unique()
    table.string("email").unique()
    table.string("password")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("app_user")
  return knex.raw('drop extension if exists "uuid-ossp"')
}
