module.exports = {

  test: {
    client: 'pg',
    connection: {
      database: 'probodb_test',
      user:     'probodb_test',
      password: 'password',
      host: 'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'probodb',
      user:     'probodb',
      password: 'password',
      host: 'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
