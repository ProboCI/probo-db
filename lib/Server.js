'use strict';

const eventbus = require('probo-eventbus');
const through2 = require('through2');

class Server {
  constructor(options) {
    this.db = options.db;
    this.config = options.config;
    this.logger = options.logger;

    this.consumer = new eventbus.plugins[this.config.buildsEventStream.plugin].Consumer(this.config.buildsEventStream.config);

    const commitStreamOptions = {
      autoCommit: true,
      autoCommitIntervalMs: 1000,
      autoCommitMsgCount: 1000,
    };

    this.commitStream = this.consumer.createCommitStream(commitStreamOptions);
    this.dbPlugins = options.dbPlugins;
  }

  start() {
    const self = this;
    self.testConnection(function() {
      self.consumeData();
    });
  }

  testConnection(done) {
    const self = this;
    self.logger.info('Attempting to connect to database...');

    self.db.test()
      .then(function(result) {
        self.logger.info('Database connection successful!');
        self.logger.info('Rows found: ', result.rows[0].count);
        done();
      })
      .catch(function(error) {
        self.logger.error(error);
        process.exit(1);
      });
  }

  consumeData() {
    const self = this;
    let buildPipeline = self.consumer.rawStream
      .pipe(through2.obj(function(data, enc, cb) {
        if (!data.data || !data.data.build) {
          cb(null, data);
          return;
        }
        self.db.saveBuild(data.data.build)
          .then(function() {
            cb(null, data);
          })
          .catch(function(error) {
            cb(error);
          });
      }));

    self.dbPlugins.forEach(function(plugin) {
      buildPipeline = buildPipeline.pipe(through2.obj(function(data, enc, cb) {
        if (!data.data || !data.data.build) {
          cb(null, data);
          return;
        }
        plugin.process(data.data.build)
          .then(function(result) {
            cb(null, data);
          })
          .catch(function(error) {
            cb(error);
          });
      }));
    });

    buildPipeline = buildPipeline.pipe(self.commitStream);
  }
}

module.exports = Server;
