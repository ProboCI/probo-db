'use strict';

const uuidV4 = require('uuid/v4');

let prNum = 0;

function createEntry(build) {
  prNum++;
  return {
    branchName: build.branchName,
    branchUrl: 'https://probo.ci',
    buildId: uuidV4(),
    bytesReal: 1000,
    bytesVirtual: 2000,
    commitRef: 'abc123',
    commitUrl: 'https://probo.ci',
    config: JSON.stringify({}),
    pinned: false,
    prDescription: 'This is a PR',
    prName: build.prName,
    prNumber: prNum,
    projectId: uuidV4(),
    prUrl: 'https://probo.ci',
    reaped: build.reaped,
    reapedDate: new Date(),
    reapedReason: 1,
    reapedReasonText: 'some reason',
    requestId: uuidV4(),
    statusBuild: 'pending',
    statusSubmitted: 'pending',
    timeStarted: new Date(),
    timeUpdated: new Date(),
  };
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('build').del()
    .then(function () {
      return knex('build').insert([
        createEntry({branchName: 'firstBranch', prName: 'firstPr', reaped: false}),
        createEntry({branchName: 'secondBranch', prName: 'secondPr', reaped: false}),
        createEntry({branchName: 'thirdBranch', prName: 'thirdPr', reaped: false}),
        createEntry({branchName: 'fourthBranch', prName: 'fourthPr', reaped: false}),
        createEntry({branchName: 'fifthBranch', prName: 'fifthPr', reaped: false})
      ]);
    });
};
