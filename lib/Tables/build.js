'use strict';

const baseTable = require('./baseTable');

class build extends baseTable {

  tableName() {
    return 'build';
  }

  schema() {
    return [
      'id',
      'uuid',
      'branchName',
      'branchUrl',
      'bytesReal',
      'bytesVirtual',
      'commitRef',
      'commitUrl',
      'config',
      'pinned',
      'projectId',
      'prDescription',
      'prName',
      'prNumber',
      'prUrl',
      'reaped',
      'reapedDate',
      'reapedReason',
      'reapedReasonText',
      'requestId',
      'statusSubmitted',
      'statusBuild',
      'timeStarted',
      'timeUpdated'
    ];
  }
}

module.exports = build;