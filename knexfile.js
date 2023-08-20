/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    debug: false,
    connection: {
      port: process.env.DATABASE_PORT || 5432,
      database: process.env.DATABASE_NAME || "Library_Management",
      user: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_USER || "postgres",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "<Your Staging DB>",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "<Your Production DB>",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};