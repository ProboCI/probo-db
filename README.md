# Probo-DB

A database service that consumes event data from an eventbus stream and stores it in PostgreSQL.

The database is designed to be able to process and reprocess data from a system such as Apache Kafka. Therefore each step of the data processing and storage pipeline needs to be able to see the same piece of data multiple times without issue.

## Plugins

The project supports plugins. Plugins should be a separate project and should be referenced by path in the configuration. The plugin project should expose the plugins, in the order they should be run.

```javascript
const myPlugin = require('./lib/myPlugin');

module.exports = {
  dbPlugins: [
    myPlugin
  ]
};
```

Each plugin must export a class that must implements a `process` method. The `process` method will be given a build object which it can then act on. Additionally, the constructor for this class will be handed a database connection via knex. A valid plugin might look like the following:

```javascript
class myPlugin {

  constructor(knex) {
    this.knex = knex;
  }

  process(build) {
    let record = this.prepare(build);

    return this.knex(‘some_table’)
      .insert(record);
  }

  prepare(build) {
	  // extract data and return object.
  }
}

module.exports = myPlugin;
```

Plugins can also have migrations in order to add their own tables. Migrations are combined into a single folder and run together using `./bin/migrate`. To have your plugin’s migrations run, add them to a directory called `migrations`. See the knex migration documentation for more information on creating migrations.
