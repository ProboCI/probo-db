'use strict';

const uuidV4 = require('uuid/v4');

let prNum = 0;

function createEntry(build) {
  prNum++;
  return {
    branchName: build.branchName,
    branchUrl: 'https://probo.ci',
    buildId: build.buildId || uuidV4(),
    bytesReal: 1000 + prNum,
    bytesVirtual: 2000 + prNum,
    commitRef: 'abc123',
    commitUrl: 'https://probo.ci',
    config: JSON.stringify({}),
    pinned: false,
    prDescription: 'This is a PR',
    prName: build.prName,
    prNumber: prNum,
    projectId: build.projectId || uuidV4(),
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
  // Reset the counter if this is run again.
  prNum = 0;
  // Deletes ALL existing entries
  return knex('build').del()
    .then(function () {
      return knex('build').insert([
        createEntry({branchName: 'firstBranch', prName: 'firstPr', reaped: false, buildId: 'edae5055-db9e-4ae4-8863-7561cb6e0aa2'}),
        createEntry({branchName: 'secondBranch', prName: 'secondPr', reaped: false}),
        createEntry({branchName: 'thirdBranch', prName: 'thirdPr', reaped: false}),
        createEntry({branchName: 'fourthBranch', prName: 'fourthPr', reaped: false, projectId: 'c01f0f8c-9774-43e7-b717-5ca78bd44c01'}),
        createEntry({branchName: 'fifthBranch', prName: 'fifthPr', reaped: false, projectId: 'c01f0f8c-9774-43e7-b717-5ca78bd44c01'}),
        createEntry({branchName: 'branch6', prName: 'pr6', reaped: true, projectId: 'c01f0f8c-9774-43e7-b717-5ca78bd44c01'}),
        createEntry({branchName: 'branch7', prName: 'pr7', reaped: true, projectId: '5140b34e-21ed-4395-85bf-f3bda5adaa14'}),
        createEntry({branchName: 'branch8', prName: 'pr8', reaped: true, projectId: '5140b34e-21ed-4395-85bf-f3bda5adaa14'}),
      ]);
    });
};
