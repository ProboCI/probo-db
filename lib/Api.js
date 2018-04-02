'use strict';

const restify = require('restify');

class Api {

  constructor(options) {
    this.server = restify.createServer({name: options.config.serverName});
    this.server.use(restify.plugins.bodyParser());
    this.db = options.db;
    this.logger = options.logger;
    this.plugins = options.apiPlugins;
    this.port = options.config.port;
    this.host = options.config.host;
    this.version = options.config.version;
    this.addRoutes();
  }

  addRoutes() {
    let self = this;

    function checkObjectMiddleware(req, res, next) {
      let type = req.params.type;
      createUUIDMiddleware(type, 'id')(req, res, next);
    }

    function checkObjectEmptyMiddleware(req, res, next) {
      let type = req.params.type;
      createUUIDMiddleware(type, 'id', true)(req, res, next);
    }

    function checkTypeMiddleware(req, res, next) {
      let type = req.params.type;
      createTypeMiddleware(type)(req, res, next);
    }

    function checkBuildMiddleware(req, res, next) {
      createUUIDMiddleware('build', 'build')(req, res, next);
    }

    function checkProjectMiddleware(req, res, next) {
      createUUIDMiddleware('project', 'project')(req, res, next);
    }

    function createTypeMiddleware(type) {
      return function(req, res, next) {
        let type = req.params.type;
        if (!self.typeIsValid(type)) {
          let error = new Error();
          error.message = `Invalid type ${type}`;
          self.logger.error(error);
          next(error);
        } else {
          next();
        }
      }
    }

    function createUUIDMiddleware(type, property) {
      return function(req, res, next) {
        let id = req.params[property];
        if (!self.uuidIsValid(id)) {
          let error = new Error();
          error.message = `Invalid ${type} id`;
          self.logger.error(error);
          next(error);
        } else {
          next();
        }
      }
    }

    self.server.get('/', function(req, res, next) {
      self.getVersion(req, res, next);
    });
    self.server.head('/', function(req, res, next) {
      self.getVersion(req, res, next);
    });

    self.server.get('/get/:type/:id', checkObjectMiddleware, function(req, res, next) {
      // gets a single object
      // add a flag for creating object if it does not exist (getOrCreate)
      // Don't get deleted by default (add flag)
      self.getObject(req, res, next);
    });

    self.server.post('/create/:type', checkTypeMiddleware, function(req, res, next) {
      // use for create, what about createOrUpdate and assign?
      self.createObject(req, res, next);
    });

    self.server.put('/update/:type/:id', checkObjectMiddleware, function(req, res, next) {
      // use for update, what about createOrUpdate and assign?
      self.createObject(req, res, next);
    });

    self.server.del('/delete/:type/:id', checkObjectMiddleware, function(req, res, next) {
      self.deleteObject(req, res, next);
    });

    self.server.get('/find/:type', checkTypeMiddleware, function(req, res, next) {
      // Get a bunch of objects
      // Use for find, findOne
      // Don't get deleted by default (add flag)
      self.getObjects(req, res, next);
    });

    self.server.get('/project', function(req, res, next) {
      self.getProjects(req, res, next);
    });

    self.server.get('/project/:project/disk-usage', checkProjectMiddleware, function(req, res, next) {
      self.getProjectDiskTotal(req, res, next);
    });

    self.server.get('/build', function(req, res, next) {
      self.getBuilds(req, res, next);
    });

    self.server.get('/build/:build', checkBuildMiddleware, function(req, res, next) {
      self.getBuildById(req, res, next);
    });

    self.server.get('/build/:build/disk-usage', checkBuildMiddleware, function(req, res, next) {
      self.getBuildSize(req, res, next);
    });

    self.plugins.map(function(plugin) {
      plugin.addRoutes(self.server);
    });

  }

  uuidIsValid(uuid) {
    let re = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
    return uuid.match(re);
  }

  typeIsValid(type) {
    let re = new RegExp('^[0-9a-zA-Z]*');
    return type.match(re);
  }

  getObjects(req, res, next) {
    let self = this;
    let type = req.params.type;
    let filters = req.query;
    // @todo: column 'deleted' does not exist.
    // Should it?
    /*if (!req.query.allowDeleted == 1) {
      filters.deleted = 0;
    }*/

    self.db.getObjects(type, filters, {})
      .then(function(result) {
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  getObject(req, res, next) {
    let self = this;
    let type = req.params.type;
    let id = req.params.id;
    let filters = {uuid: id}
    // @todo: column 'deleted' does not exist.
    // Should it?
    /*if (!req.query.allowDeleted == 1) {
      filters.deleted = 0;
    }*/

    // @todo: add a flag for creating object if not found
    // similar to get_or_create from coordinator
    self.db.getObjects(type, filters, {getOne: true})
      .then(function(result) {
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  deleteObject(req, res, next) {
    let self = this;
    let type = req.params.type;
    let id = req.params.id;

    if (!id) {
      let error = new Error();
      error.message = `Invalid id on ${type}`;
      self.logger.error(error);
      next(error);
    }
    else {
      self.db.deleteObject(type, id, {})
        .then(function(result) {
          res.send({count: result});
          next();
        })
        .catch(function(error) {
          self.logger.error(error);
          next(error);
        });
    }
  }

  createObject(req, res, next) {
    let self = this;
    let type = req.params.type;
    let data = req.body;
    self.db.createObject(type, data)
      .then(function(result) {
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  getBuilds(req, res, next) {
    let self = this;
    self.db.getBuilds()
      .then(function(result) {
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  getProjects(req, res, next) {
    let self = this;
    self.db.getProjects()
      .then(function(result) {
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  getBuildById(req, res, next) {
    let self = this;
    let buildId = req.params.build;

    self.db.getBuildById(buildId)
      .then(function(result) {
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  getBuildSize(req, res, next) {
    let self = this;
    let buildId = req.params.build;

    self.db.getBuildSize(buildId)
      .then(function(result) {
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  getProjectDiskTotal(req, res, next) {
    let self = this;
    let projectId = req.params.project;

    self.db.getProjectDiskTotal(projectId)
      .then(function(result) {
        // Zero is returned as an empty object rather than a proper number if
        // we don't convert it to a string.   :-(
        if (result === 0) {
          result = '0';
        }
        res.send(result);
        next();
      })
      .catch(function(error) {
        self.logger.error(error);
        next(error);
      });
  }

  getVersion(req, res, next) {
    let self = this;
    res.send(`${self.server.name} version ${self.version}` );
    next();
  }

  start() {
    let self = this;
    self.server.listen(self.port, self.host, function() {
      self.logger.info('API server started: %s listening at %s', self.server.name, self.server.url);
    });
  }

  stop() {
    let self = this;
    self.server.close(function() {
      self.logger.info('API server stopped');
    });
  }

}

module.exports = Api;
