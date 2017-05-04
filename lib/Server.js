'use strict';

const through2 = require('through2');

class Server {
  constructor(options) {
    this.consumer = options.consumer;
  }
  storeBuildInDatabase(build, done) {
    // Do stuff
    let error = null;
    done(null);
  }

  start() {
    const self = this;
    const commitStreamOptions = {
      autoCommit: true,
      autoCommitIntervalMs: 1000,
      autoCommitMsgCount: 1000,
    }
    self.consumer.rawStream.pipe(through2.obj(function(data, enc, cb) {
      console.log(data);
      self.storeBuildInDatabase(data.data.build, function(error) {
        if (error) {
          freakOut();
        }
        cb(null, data);
      });
    }))
    .pipe(self.consumer.createCommitStream(commitStreamOptions));

  }
}

module.exports = Server;
