# Probo-DB

A database service that consumes event data from an [eventbus](https://github.com/ProboCI/probo-eventbus) stream and stores it in PostgreSQL.  It also has a rest api for performing crud functions and other tasks.

The database is designed to be able to process and reprocess data from a system such as Apache Kafka. Therefore each step of the data processing and storage pipeline needs to be able to see the same piece of data multiple times without issue.

The database is abstracted by [knex](http://knexjs.org/) and relies on postgres. Review the appropriate documentation for details on these projects.

The REST API is built using [Restify](http://restify.com/).

## Configuration

By default, the knexfile.js is used to run migrations and as the configuration to the proboDb server. You can override this is a few ways, first, you can specify a path to a knexfile anywhere on the filesystem by passing the `-k` flag when starting the server:

```
./bin/probo-db -k /path/to/knex/file.js
```

Configuration is also inherited from yaml config that can be passed in via the `-c` flag:

```
./bin/probo-db -c /path/to/config/file.yaml
```

If both options are used, the knex connection data from the yaml file will be used over that passed in via the knexfile.js.

Since knex and migrations assume a `knexfile.js`, it is recommended to provide this rather than specifying configuration in the yaml file.

## Plugins

The project supports plugins. Plugins should be a separate project and should be referenced by path in the configuration. The plugin project should expose the plugins as properties on the exported object. Database plugins should be called `buildEventPlugins` and should be in the order they should be run. These are specifically for handling kafka data coming through on the build event pipeline.

Api plugins will add routes to the REST API server. They must be added as an array to a property called `apiPlugins`. Order is not important as these will be routes to access data out of band.

The project also supports tablePLugins which act as a description of a specific table for data storage.  They perform the crud functions and are assumed to be based on the base table plugin class (at /lib/table/baseTable.js).

```javascript
const myBuildEventPlugin = require('./myBuildEventPlugin');
const myApiPlugin = require('./myApiPlugin');
const myTablePlugin = require('./myTablePlugin');

module.exports = {
  buildEventPlugins: [
    myBuildEventPlugin
  ],
  apiPlugins: [
    myApiPlugin
  ],
  tablePlugins: [
    myTablePlugin
  ]
};
```

Each build event plugin must export a class that must implements a `process` method. The `process` method will be given a build object which it can then act on. Additionally, the constructor for this class will be handed options that include a logger and a database connection via knex. A valid database plugin might look like the following:

```javascript
class myDbPlugin {

  constructor(options) {
    this.knex = options.knex;
    this.logger = options.logger;
  }

  process(build) {
    let record = this.prepare(build);

    return this.knex('some_table')
      .insert(record);
  }

  prepare(build) {
    // extract data and return object.
    self.logger.info('Return some feedback');
  }
}

module.exports = myDbPlugin;
```

An API plugin will also receive an object that includes a knex connection and a logger. The API plugin must implement an `addRoutes` method that will be handed a restify `server` object and will append new routes to it. A valid api plugin might look like the following:

```javascript
class myApiPlugin {

  constructor(options) {
    this.knex = options.knex;
    this.logger = options.logger;
  }

  addRoutes(server) {
    let self = this;
    server.addRoute('/some/route', function(req, res, next) {
      self.knex
        .select('*')
        .from('mytable')
        .then(function(result) {
          self.logger.info('Return some feedback');
          res.send(result);
          next()
        })
        .catch(function(error) {
          self.logger.error('Bad stuff happened...');
          next(error);
        });
    });
  }

}

module.exports = myApiPlugin;
```

A Table plugin will extent the baseTable class (lib/table/baseTable.js) and should implement the tableName, and schema methods.  The schema will be setup in knex.  A valid table plugin could look like the following:

```javascript
const baseTable = require('./baseTable');

class myPlugin extends baseTable {

  tableName() {
    return 'my_plugin';
  }

  schema() {
    return [
      'id',
      'uuid',
      'timeStarted',
      'timeUpdated',
      'description',
      'title'
    ];
  }
}

module.exports = myPlugin;
```

## Migrations

Migrations are stored in the `baseMigrations` directory. Create these using knex.

Plugins can also have migrations in order to add their own tables. Migrations are combined into a single folder and run together using `./bin/migrate`. To have your plugin’s migrations run, add them to a directory called `migrations` in the plugin's folder. See the knex migration documentation for more information on creating migrations.
