'use strict';

class Db {
  constructor(knex) {
    this.knex = knex;
  }

  test() {
    return this.knex.raw('SELECT count(*) FROM build');
  }

  saveBuld(build) {
    let self = this;
    let buildData = self.dbDataFromBuild(build);
    return self.knex('build')
      .where('buildId', build.id)
      .del()
      .then(function() {
        return self.knex('build').insert(buildData);
      });
  }

  dbDataFromBuild(build) {
    return {
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
      projectId: build.projectId,
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
    };
  }
}

module.exports = Db;
