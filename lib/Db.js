'use strict';

class Db {
  constructor(config) {
    this.knex = require('knex')({
      client: config.dbType,
      connection: {
        host : config.dbHost,
        user : config.dbUser,
        password : config.dbPassword,
        database : config.dbName
      }
    });
  }

  test() {
    return this.knex.raw('SELECT count(*) FROM build');
  }

  getRequestId(build) {
    return this.knex('build')
      .first('requestId')
      .where({requestId: build.requestId});
  }

  saveBuld(build) {
    let self = this;
    return self.knex('build')
      .where('buildId', build.id)
      .del()
      .then(function() {
        return self.knex('build').insert({
          branchName: build.branch.name,
          branchUrl: build.branch.htmlUrl,
          buildId: build.id,
          bytesReal: build.diskSpace.realBytes,
          bytesVirtual: build.diskSpace.virtualBytes,
          commitRef: build.commit.ref,
          commitUrl: build.commit.htmlUrl,
          config: JSON.stringify(build.config),
          pinned: build.pinned,
          prDescription: build.pullRequest.description,
          prName: build.pullRequest.name,
          prNumber: build.pullRequest.number,
          prUrl: build.pullRequest.htmlUrl,
          reaped: build.reaped,
          reapedDate: build.reapedDate,
          reapedReason: build.reapedReason,
          reapedReasonText: build.reapedReasonText,
          requestId: build.requestId,
          statusBuild: build.status,
          statusSubmitted: build.submittedState,
          timeStarted: build.createdAt,
          timeUpdated: build.updatedAt,
        });
      });
  }
}


module.exports = Db;
