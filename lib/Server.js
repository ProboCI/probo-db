'use strict';

const eventbus = require('probo-eventbus');
const through2 = require('through2');
let num = 0;

class Server {
  constructor(options) {
    this.db = options.db;
    this.config = options.config;

    // MAKE ME CONFIGURABLE
    this.consumer = new eventbus.plugins['Kafka'].Consumer({
      group: 'proboDb',
      topic: 'build_events',
      version: 1,
    });

    const commitStreamOptions = {
      autoCommit: true,
      autoCommitIntervalMs: 1000,
      autoCommitMsgCount: 1000,
    };

    this.commitStream = this.consumer.createCommitStream(commitStreamOptions);
  }

  storeBuildData(build, done) {
    this.db.saveBuld(build)
      .then(function(result) {
        done(null);
       })
      .catch(function(error) {
        console.error(error);
        done(error);
      });
  }

  filterDuplicateRequests(build, done) {
    this.db.getRequestId(build)
      .then(function(result) {
        done(null, result);
       })
      .catch(function(error) {
        console.error(error);
        done(error);
      });
  }

  start() {
    const self = this;

    self.db.test()
      .then(function(result) {
        console.log(result.rows, 'RESULT');
      })
      .catch(function(error) {
        console.error(error);
      });

    let dataPipeline = self.consumer.rawStream
      .pipe(through2.obj(function(data, enc, cb) {
        data.isDuplicate = false;
        cb(null, data);
      }))
      .pipe(through2.obj(function(data, enc, cb) {
        console.log('EVENT 1');
        self.filterDuplicateRequests(data.data.build, function(error, result) {
          console.log('RESULT', result);
          if (error) {
            cb(error);
          }
          if (result) {
            data.isDuplicate = true;
          }
          cb(null, data);
        });
      }));

    dataPipeline
      .pipe(through2.obj(function(data, enc, cb) {
        console.log('EVENT 2');
        // Pass only duplicates to the fast commit stream.
        if (data.isDuplicate) {
          cb(null, data);
        } else {
          cb(null);
        }
      }))
      .pipe(through2.obj(function(data, enc, cb) {
        console.log('DUPLICATE EVENT');
        cb(null, data);
      }))
      .pipe(self.commitStream);

    dataPipeline
      .pipe(through2.obj(function(data, enc, cb) {
        console.log('EVENT 3');
        // Pass only new items to the pipeline.
        if (!data.isDuplicate) {
          cb(null, data);
        } else {
          cb(null);
        }
      }))
      .pipe(through2.obj(function(data, enc, cb) {
        console.log('NEW EVENT');
        cb(null, data);
      }))
      .pipe(through2.obj(function(data, enc, cb) {
        console.log('EVENT #', num);
        num++;
        self.storeBuildData(data.data.build, function(error) {
          if (error) {
            console.error(error);
            cb(error);
          }
          cb(null, data);
        });
      }))
      .pipe(self.commitStream);
    // self.consumer.rawStream.pipe(through2.obj(function(data, enc, cb) {
    //   self.storeBuildInDatabase(data.data.build, function(error) {
    //     if (error) {
    //       freakOut();
    //     }
    //     cb(null, data);
    //   });
    // }))

  }
}

module.exports = Server;
