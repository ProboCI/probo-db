'use strict';

class Db {
  constructor(options) {
    this.knex = options.knex;
    this.logger = options.logger;
  }

  test() {
    return this.knex.raw('SELECT count(*) FROM build');
  }

  saveBuild(build) {
    let self = this;
    let buildData = self.dbDataFromBuild(build);
    return self.knex('build')
      .where('buildId', build.id)
      .del()
      .then(function() {
        return self.knex('build').insert(buildData);
      });
  }

  getProjects() {
    return this.knex('build')
      .distinct('projectId')
      .map(function(row) {
        return row.projectId;
      });
  }

  getBuilds() {
    return this.knex('build')
      .distinct('buildId')
      .map(function(row) {
        return row.buildId;
      });
  }

  getBuildById(buildId) {
    return this.knex('build')
      .first()
      .where({buildId});
  }

  getBuildSize(buildId) {
    return this.getBuildById(buildId)
      .then(function(result) {
        return result.bytesReal;
      });
  }


  getProjectDiskTotal(projectId) {
    return this.knex
      .select('projectId')
      .sum('bytesReal')
      .from('build')
      .where({'projectId': projectId})
      .groupBy('projectId')
      .first()
      .then(function(result) {
        return result.sum;
      });
  }

  dbDataFromBuild(build) {
    return {
      branchName: build.branch.name,
      branchUrl: build.branch.htmlUrl,
      buildId: build.id,
      bytesReal: build.diskSpace.realBytes || 0,
      bytesVirtual: build.diskSpace.virtualBytes || 0,
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
