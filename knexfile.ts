const knexSettings = {
  development: {
    client: 'pg',
    connection: {
      // TODO set database connection settings
      user: 'TODO',
      password: 'TODO',
      database: 'TODO',
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    debug: false,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    debug: false,
  },
}

export default knexSettings
