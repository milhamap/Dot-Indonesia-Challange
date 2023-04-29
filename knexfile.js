require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: 'utc',
      charset: 'utf8mb4'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/databases/migrations'
    },
    seeds: {
      directory: './src/databases/seeds'
    }
  }
};
