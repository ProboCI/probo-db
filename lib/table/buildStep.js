'use strict';

const baseTable = require('./baseTable');

class buildStep extends baseTable {

  tableName() {
    return 'build_step';
  }

  schema() {
    return [
      'id',
      'uuid',
      'buildId',
      'order',
      'description',
      'name',
      'plugin',
      'state',
      'resultCode',
      'resultDuration'
    ];
  }
}

module.exports = buildStep;