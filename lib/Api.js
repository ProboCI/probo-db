'use strict';

const restify = require('restify');

class Api {

  constructor(options) {
    this.server = restify.createServer({name: options.config.serverName});
    this.db = options.db;
    this.logger = options.logger;
    this.port = options.config.port;
    this.host = options.config.host;
    this.version = options.config.version;
    this.addRoutes();
  }

  addRoutes() {
    let self = this;

    self.server.get('/', function(req, res, next) {
      self.getVersion(req, res, next);
    });
    self.server.head('/', function(req, res, next) {
      self.getVersion(req, res, next);
    });

    self.server.get('/project', function(req, res, next) {
      self.getProjects(req, res, next);
    });

    self.server.get('/build', function(req, res, next) {
      self.getBuilds(req, res, next);
    });

    self.server.get('/build/:build', function(req, res, next) {
      self.getBuildById(req, res, next);
    });

    self.server.get('/build/:build/size', function(req, res, next) {
      self.getBuildSize(req, res, next);
    });

  }

  uuidIsValid(uuid) {
    let re = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
    return uuid.match(re);
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

    if (!self.uuidIsValid(buildId)) {
      let e = new Error('Invalid build id');
      next(e);
    }

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

}

module.exports = Api;
