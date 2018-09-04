'use strict';

const baseTable = require('./baseTable');

class build extends baseTable {

  tableName() {
    return 'build';
  }

  schema() {
    return [
      'buildId',
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

  idField() {
    return 'buildId';
  }

  uuid() {
    return true;
  }
}

module.exports = build;
