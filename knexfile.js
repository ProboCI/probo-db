module.exports = {

  test: {
    client: 'postgresql',
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
    client: 'postgresql',
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
