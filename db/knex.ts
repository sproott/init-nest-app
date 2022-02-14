import { Knex, knex } from 'knex'

import knexSettings from '../knexfile'

const config = knexSettings[process.env.NODE_ENV] ?? knexSettings['development']
const customKnex: Knex = knex(config)

export { customKnex as knex }
