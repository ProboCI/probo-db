'use strict';

const eventbus = require('probo-eventbus');
const through2 = require('through2');

class Server {
  constructor(options) {
    this.db = options.db;
    this.config = options.config;

    this.consumer = new eventbus.plugins['Kafka'].Consumer({
      group: options.config.eventGroup,
      topic: options.config.eventTopic,
      version: options.config.eventVersion,
    });

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
    console.log('Attempting to connect to DB');

    self.db.test()
      .then(function(result) {
        console.log(result.rows, 'RESULT');
        console.log('Connection successful!');
        done();
      })
      .catch(function(error) {
        console.error(error);
        process.exit(1);
      });
  }

  consumeData() {
    const self = this;
    let buildPipeline = self.consumer.rawStream
      .pipe(through2.obj(function(data, enc, cb) {
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
